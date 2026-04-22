import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdmin } from './_requireAdmin';
import { db } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        if (!requireAdmin(req, res)) return;
        try {
            const { rows } = await db.execute('SELECT * FROM surveys ORDER BY createdAt DESC');
            return res.status(200).json(rows);
        } catch (error) {
            console.error('[surveys GET]', error);
            return res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { name, phone, satisfaction, helpfulness, feedback, constructiveOpinion } = req.body;

            if (!name || satisfaction == null || !feedback || !constructiveOpinion) {
                return res.status(400).json({ error: '이름, 만족도, 피드백, 건의사항은 필수입니다.' });
            }
            if (typeof satisfaction !== 'number' || satisfaction < 1 || satisfaction > 5) {
                return res.status(400).json({ error: '만족도는 1~5 사이 숫자여야 합니다.' });
            }

            const id = crypto.randomUUID();
            const createdAt = new Date().toISOString();

            await db.execute({
                sql: `INSERT INTO surveys (id, name, phone, satisfaction, helpfulness, feedback, constructiveOpinion, createdAt)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [id, name, phone || '', satisfaction, helpfulness ?? satisfaction, feedback, constructiveOpinion, createdAt]
            });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('[surveys POST]', error);
            return res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
