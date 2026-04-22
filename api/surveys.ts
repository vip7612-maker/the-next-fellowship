import { createClient } from '@libsql/client/http';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdmin } from './_requireAdmin';

const db = createClient({
    url: process.env.TURSO_DATABASE_URL as string,
    authToken: process.env.TURSO_AUTH_TOKEN as string,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        if (!requireAdmin(req, res)) return;
        try {
            const { rows } = await db.execute('SELECT * FROM surveys ORDER BY createdAt DESC');
            return res.status(200).json(rows);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'POST') {
        try {
            const { name, phone, satisfaction, helpfulness, feedback, constructiveOpinion } = req.body;
            const id = crypto.randomUUID();
            const createdAt = new Date().toISOString();

            await db.execute({
                sql: `INSERT INTO surveys (id, name, phone, satisfaction, helpfulness, feedback, constructiveOpinion, createdAt)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [id, name, phone || '', satisfaction, helpfulness ?? satisfaction, feedback, constructiveOpinion, createdAt]
            });
            return res.status(200).json({ success: true });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
