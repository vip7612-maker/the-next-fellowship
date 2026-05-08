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
    if (!requireAdmin(req, res)) return;

    const type = String(req.query.type || '');

    try {
        // ===== 템플릿 =====
        if (type === 'templates' && req.method === 'GET') {
            const { rows } = await db.execute('SELECT * FROM sms_templates ORDER BY updatedAt DESC');
            return res.status(200).json(rows);
        }

        if (type === 'template' && req.method === 'POST') {
            const { title, content, category } = req.body;
            if (!title || !content) return res.status(400).json({ error: '제목/본문은 필수입니다.' });
            const id = crypto.randomUUID();
            const now = new Date().toISOString();
            await db.execute({
                sql: 'INSERT INTO sms_templates (id, title, content, category, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
                args: [id, title, content, category || '', now, now]
            });
            return res.status(200).json({ success: true, id });
        }

        if (type === 'template' && req.method === 'PUT') {
            const { id, title, content, category } = req.body;
            if (!id) return res.status(400).json({ error: 'id 필수' });
            await db.execute({
                sql: `UPDATE sms_templates
                      SET title = COALESCE(?, title),
                          content = COALESCE(?, content),
                          category = COALESCE(?, category),
                          updatedAt = ?
                      WHERE id = ?`,
                args: [title ?? null, content ?? null, category ?? null, new Date().toISOString(), id]
            });
            return res.status(200).json({ success: true });
        }

        if (type === 'template' && req.method === 'DELETE') {
            const { id } = req.query;
            if (!id || typeof id !== 'string') return res.status(400).json({ error: 'id 필수' });
            await db.execute({ sql: 'DELETE FROM sms_templates WHERE id = ?', args: [id] });
            return res.status(200).json({ success: true });
        }

        // ===== 발송 이력 =====
        if (type === 'logs' && req.method === 'GET') {
            const { rows } = await db.execute('SELECT * FROM sms_send_logs ORDER BY sentAt DESC LIMIT 200');
            return res.status(200).json(rows);
        }

        if (type === 'log' && req.method === 'GET') {
            const { id } = req.query;
            if (!id || typeof id !== 'string') return res.status(400).json({ error: 'id 필수' });
            const log = await db.execute({ sql: 'SELECT * FROM sms_send_logs WHERE id = ?', args: [id] });
            if (log.rows.length === 0) return res.status(404).json({ error: '이력 없음' });
            const recipients = await db.execute({
                sql: 'SELECT * FROM sms_send_recipients WHERE sendLogId = ? ORDER BY name',
                args: [id]
            });
            return res.status(200).json({ ...log.rows[0], recipients: recipients.rows });
        }

        return res.status(400).json({ error: 'Unknown type or method' });
    } catch (error) {
        console.error('[smsAdmin]', error);
        return res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
    }
}
