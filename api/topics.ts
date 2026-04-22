import { createClient } from '@libsql/client/http';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const db = createClient({
    url: process.env.TURSO_DATABASE_URL as string,
    authToken: process.env.TURSO_AUTH_TOKEN as string,
});

const isValidPhone = (phone: string) => /^\d{9,11}$/.test(phone.replace(/[^0-9]/g, ''));

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            const { rows } = await db.execute('SELECT * FROM topics ORDER BY votes DESC');
            return res.status(200).json(rows);
        } catch (error) {
            console.error('[topics GET]', error);
            return res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { title, description, authorName, authorPhone } = req.body;

            if (!title || !description || !authorName || !authorPhone) {
                return res.status(400).json({ error: '제목, 설명, 이름, 연락처는 필수입니다.' });
            }
            if (!isValidPhone(authorPhone)) {
                return res.status(400).json({ error: '유효한 전화번호 형식이 아닙니다.' });
            }

            const id = crypto.randomUUID();
            const createdAt = new Date().toISOString().split('T')[0];

            await db.execute({
                sql: `INSERT INTO topics (id, title, description, votes, createdAt, authorName, authorPhone)
                      VALUES (?, ?, ?, ?, ?, ?, ?)`,
                args: [id, title, description, 1, createdAt, authorName, authorPhone]
            });

            // 작성자를 자동으로 첫 투표자로 등록
            const voteId = crypto.randomUUID();
            await db.execute({
                sql: `INSERT INTO topic_votes (id, topicId, name, phone, createdAt) VALUES (?, ?, ?, ?, ?)`,
                args: [voteId, id, authorName, authorPhone, new Date().toISOString()]
            });

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('[topics POST]', error);
            return res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
