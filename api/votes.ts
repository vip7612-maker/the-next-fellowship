import { createClient } from '@libsql/client/http';

const db = createClient({
    url: process.env.TURSO_DATABASE_URL as string,
    authToken: process.env.TURSO_AUTH_TOKEN as string,
});

export default async function handler(req: any, res: any) {
    if (req.method === 'GET') {
        try {
            const { topicId } = req.query;
            let query = 'SELECT * FROM topic_votes';
            let args: any[] = [];

            if (topicId) {
                query += ' WHERE topicId = ?';
                args.push(topicId);
            }
            query += ' ORDER BY createdAt DESC';

            const { rows } = await db.execute({ sql: query, args });
            return res.status(200).json(rows);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'POST') {
        try {
            const { id, topicId, name, phone, createdAt } = req.body;

            // Check for duplicates
            const { rows: existing } = await db.execute({
                sql: 'SELECT id FROM topic_votes WHERE topicId = ? AND name = ? AND phone = ?',
                args: [topicId, name, phone]
            });

            if (existing.length > 0) {
                return res.status(400).json({ error: '이미 이 주제에 신청(투표)하셨습니다.' });
            }

            // Insert new vote
            await db.execute({
                sql: `INSERT INTO topic_votes (id, topicId, name, phone, createdAt)
                      VALUES (?, ?, ?, ?, ?)`,
                args: [id, topicId, name, phone, createdAt]
            });

            // Increment the topic vote count securely
            await db.execute({
                sql: `UPDATE topics SET votes = votes + 1 WHERE id = ?`,
                args: [topicId]
            });

            return res.status(200).json({ success: true });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
