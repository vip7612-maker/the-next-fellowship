import { createClient } from '@libsql/client';

const db = createClient({
    url: process.env.TURSO_DATABASE_URL as string,
    authToken: process.env.TURSO_AUTH_TOKEN as string,
});

export default async function handler(req: any, res: any) {
    if (req.method === 'GET') {
        try {
            const { rows } = await db.execute('SELECT * FROM topics ORDER BY votes DESC');
            return res.status(200).json(rows);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'POST') {
        try {
            const { id, title, description, votes, createdAt, authorName, authorPhone } = req.body;
            await db.execute({
                sql: `INSERT INTO topics (id, title, description, votes, createdAt, authorName, authorPhone)
                      VALUES (?, ?, ?, ?, ?, ?, ?)`,
                args: [id, title, description, votes || 1, createdAt, authorName, authorPhone]
            });
            return res.status(200).json({ success: true });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
