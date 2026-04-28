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

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            const { id } = req.query;

            // 단건 조회: 공개 라우트 (QR로 진입한 사용자가 메타데이터를 읽기 위함)
            if (id && typeof id === 'string') {
                const { rows } = await db.execute({
                    sql: 'SELECT * FROM mentor_surveys WHERE id = ?',
                    args: [id]
                });
                if (rows.length === 0) {
                    return res.status(404).json({ error: '설문을 찾을 수 없습니다.' });
                }
                return res.status(200).json(rows[0]);
            }

            // 전체 목록: 관리자만
            if (!requireAdmin(req, res)) return;
            const { rows } = await db.execute('SELECT * FROM mentor_surveys ORDER BY round DESC, createdAt DESC');
            return res.status(200).json(rows);
        } catch (error) {
            console.error('[mentorSurveys GET]', error);
            return res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
        }
    }

    if (req.method === 'POST') {
        if (!requireAdmin(req, res)) return;
        try {
            const { round, title, eventDate, location, capacity, description } = req.body;

            if (round == null || !title) {
                return res.status(400).json({ error: '회차(round)와 제목(title)은 필수입니다.' });
            }
            const roundNum = Number(round);
            if (!Number.isInteger(roundNum) || roundNum < 1) {
                return res.status(400).json({ error: '회차는 1 이상의 정수여야 합니다.' });
            }

            const id = crypto.randomUUID();
            const createdAt = new Date().toISOString();

            await db.execute({
                sql: `INSERT INTO mentor_surveys (id, round, title, eventDate, location, capacity, description, isActive, createdAt)
                      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`,
                args: [id, roundNum, title, eventDate || '', location || '', capacity || '', description || '', createdAt]
            });

            return res.status(200).json({ success: true, id });
        } catch (error) {
            console.error('[mentorSurveys POST]', error);
            return res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
        }
    }

    if (req.method === 'PUT') {
        if (!requireAdmin(req, res)) return;
        try {
            const { id, isActive, title, eventDate, location, capacity, description } = req.body;
            if (!id) return res.status(400).json({ error: 'id는 필수입니다.' });

            // 활성/비활성 토글
            if (typeof isActive === 'boolean' || isActive === 0 || isActive === 1) {
                await db.execute({
                    sql: 'UPDATE mentor_surveys SET isActive = ? WHERE id = ?',
                    args: [isActive ? 1 : 0, id]
                });
                return res.status(200).json({ success: true });
            }

            // 메타데이터 수정
            await db.execute({
                sql: `UPDATE mentor_surveys
                      SET title = COALESCE(?, title),
                          eventDate = COALESCE(?, eventDate),
                          location = COALESCE(?, location),
                          capacity = COALESCE(?, capacity),
                          description = COALESCE(?, description)
                      WHERE id = ?`,
                args: [title ?? null, eventDate ?? null, location ?? null, capacity ?? null, description ?? null, id]
            });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('[mentorSurveys PUT]', error);
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
            await db.execute({ sql: 'DELETE FROM mentor_survey_responses WHERE surveyId = ?', args: [id] });
            await db.execute({ sql: 'DELETE FROM mentor_surveys WHERE id = ?', args: [id] });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('[mentorSurveys DELETE]', error);
            return res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
