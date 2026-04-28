import { createClient } from '@libsql/client/http';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const requireAdmin = (req: VercelRequest, res: VercelResponse): boolean => {
    const auth = req.headers.authorization;
    if (!auth || auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
        res.status(401).json({ error: '인증이 필요합니다.' });
        return false;
    }
    return true;
};

const db = createClient({
    url: process.env.TURSO_DATABASE_URL as string,
    authToken: process.env.TURSO_AUTH_TOKEN as string,
});

// 행 → 응답 매핑 (관리자 GET 또는 단건). 공개 단건은 dataUrl 포함, 관리자 목록은 페이로드 줄이기 위해 dataUrl 옵션 처리.
const rowToPublic = (row: Record<string, unknown>) => ({
    id: row.id,
    slot: row.slot,
    title: row.title,
    description: row.description,
    dataUrl: row.dataUrl,
    mimeType: row.mimeType,
    sizeBytes: row.sizeBytes,
    width: row.width,
    height: row.height,
    isActive: row.isActive,
    createdAt: row.createdAt,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            const { slot, id, list } = req.query;

            // 공개: 슬롯 키로 활성 이미지 1건
            if (slot && typeof slot === 'string') {
                const { rows } = await db.execute({
                    sql: 'SELECT * FROM gallery_images WHERE slot = ? AND isActive = 1 ORDER BY createdAt DESC LIMIT 1',
                    args: [slot]
                });
                if (rows.length === 0) return res.status(204).end();
                return res.status(200).json(rowToPublic(rows[0] as Record<string, unknown>));
            }

            // 공개: 모든 슬롯 → 이미지 매핑 (dataUrl 포함, 활성만)
            if (list === 'public') {
                const { rows } = await db.execute(
                    `SELECT g.* FROM gallery_images g
                     INNER JOIN (
                         SELECT slot, MAX(createdAt) AS maxCreated FROM gallery_images
                         WHERE isActive = 1 AND slot IS NOT NULL AND slot != ''
                         GROUP BY slot
                     ) latest ON g.slot = latest.slot AND g.createdAt = latest.maxCreated
                     WHERE g.isActive = 1`
                );
                const map: Record<string, unknown> = {};
                for (const r of rows) {
                    const row = r as Record<string, unknown>;
                    map[String(row.slot)] = rowToPublic(row);
                }
                return res.status(200).json(map);
            }

            // 관리자: 단건 조회 (dataUrl 포함)
            if (id && typeof id === 'string') {
                if (!requireAdmin(req, res)) return;
                const { rows } = await db.execute({
                    sql: 'SELECT * FROM gallery_images WHERE id = ?',
                    args: [id]
                });
                if (rows.length === 0) return res.status(404).json({ error: '이미지를 찾을 수 없습니다.' });
                return res.status(200).json(rowToPublic(rows[0] as Record<string, unknown>));
            }

            // 관리자: 전체 목록 (dataUrl 제외 → 응답 경량)
            if (!requireAdmin(req, res)) return;
            const { rows } = await db.execute(
                `SELECT id, slot, title, description, mimeType, sizeBytes, width, height, isActive, createdAt
                 FROM gallery_images ORDER BY createdAt DESC`
            );
            return res.status(200).json(rows);
        } catch (error) {
            console.error('[gallery GET]', error);
            return res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
        }
    }

    if (req.method === 'POST') {
        if (!requireAdmin(req, res)) return;
        try {
            const { slot, title, description, dataUrl, mimeType, sizeBytes, width, height } = req.body;
            if (!title || !dataUrl || !mimeType) {
                return res.status(400).json({ error: '제목/이미지 데이터/MIME 타입은 필수입니다.' });
            }
            // dataUrl 안전 검증
            if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
                return res.status(400).json({ error: 'dataUrl 형식이 올바르지 않습니다.' });
            }
            // 크기 제한 (~3MB base64 ≒ 2.2MB 실 데이터)
            if (dataUrl.length > 3 * 1024 * 1024) {
                return res.status(413).json({ error: '이미지가 너무 큽니다. 더 작은 이미지를 업로드해주세요.' });
            }

            const id = crypto.randomUUID();
            const createdAt = new Date().toISOString();

            await db.execute({
                sql: `INSERT INTO gallery_images (id, slot, title, description, dataUrl, mimeType, sizeBytes, width, height, isActive, createdAt)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
                args: [id, slot || null, title, description || '', dataUrl, mimeType, sizeBytes ?? null, width ?? null, height ?? null, createdAt]
            });
            return res.status(200).json({ success: true, id });
        } catch (error) {
            console.error('[gallery POST]', error);
            return res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
        }
    }

    if (req.method === 'PUT') {
        if (!requireAdmin(req, res)) return;
        try {
            const { id, slot, title, description, isActive } = req.body;
            if (!id) return res.status(400).json({ error: 'id는 필수입니다.' });

            await db.execute({
                sql: `UPDATE gallery_images
                      SET slot = COALESCE(?, slot),
                          title = COALESCE(?, title),
                          description = COALESCE(?, description),
                          isActive = COALESCE(?, isActive)
                      WHERE id = ?`,
                args: [
                    slot === undefined ? null : (slot || null),
                    title === undefined ? null : title,
                    description === undefined ? null : description,
                    isActive === undefined ? null : (isActive ? 1 : 0),
                    id
                ]
            });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('[gallery PUT]', error);
            return res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
        }
    }

    if (req.method === 'DELETE') {
        if (!requireAdmin(req, res)) return;
        try {
            const { id } = req.query;
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: 'id는 필수입니다.' });
            }
            await db.execute({ sql: 'DELETE FROM gallery_images WHERE id = ?', args: [id] });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('[gallery DELETE]', error);
            return res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
