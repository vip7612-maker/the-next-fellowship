import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './db';

const isValidPhone = (phone: string) => /^\d{9,11}$/.test(phone.replace(/[^0-9]/g, ''));

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            const { topicId } = req.query;
            let query = 'SELECT * FROM topic_votes';
            const args: string[] = [];

            if (topicId) {
                query += ' WHERE topicId = ?';
                args.push(topicId as string);
            }
            query += ' ORDER BY createdAt DESC';

            const { rows } = await db.execute({ sql: query, args });
            return res.status(200).json(rows);
        } catch (error) {
            console.error('[votes GET]', error);
            return res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { topicId, name, phone } = req.body;

            if (!topicId || !name || !phone) {
                return res.status(400).json({ error: '주제, 이름, 연락처는 필수입니다.' });
            }
            if (!isValidPhone(phone)) {
                return res.status(400).json({ error: '유효한 전화번호 형식이 아닙니다.' });
            }

            const id = crypto.randomUUID();
            const createdAt = new Date().toISOString();

            const { rows: existing } = await db.execute({
                sql: 'SELECT id FROM topic_votes WHERE topicId = ? AND name = ? AND phone = ?',
                args: [topicId, name, phone]
            });

            if (existing.length > 0) {
                return res.status(400).json({ error: '이미 이 주제에 신청(투표)하셨습니다.' });
            }

            await db.execute({
                sql: `INSERT INTO topic_votes (id, topicId, name, phone, createdAt) VALUES (?, ?, ?, ?, ?)`,
                args: [id, topicId, name, phone, createdAt]
            });

            await db.execute({
                sql: `UPDATE topics SET votes = votes + 1 WHERE id = ?`,
                args: [topicId]
            });

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('[votes POST]', error);
            return res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
