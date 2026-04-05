import { createClient } from '@libsql/client/http';

const db = createClient({
    url: process.env.TURSO_DATABASE_URL as string,
    authToken: process.env.TURSO_AUTH_TOKEN as string,
});

export default async function handler(req: any, res: any) {
    if (req.method === 'GET') {
        try {
            const { rows } = await db.execute('SELECT * FROM surveys ORDER BY createdAt DESC');
            return res.status(200).json(rows);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'POST') {
        try {
            const { id, name, phone, satisfaction, helpfulness, feedback, constructiveOpinion, createdAt } = req.body;
            await db.execute({
                sql: `INSERT INTO surveys (id, name, phone, satisfaction, helpfulness, feedback, constructiveOpinion, createdAt)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [id, name, phone || '', satisfaction, helpfulness || satisfaction, feedback, constructiveOpinion, createdAt]
            });
            return res.status(200).json({ success: true });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
