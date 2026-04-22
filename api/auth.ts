import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end();
    }
    const { password } = req.body;
    if (password && password === process.env.ADMIN_PASSWORD) {
        return res.status(200).json({ token: process.env.ADMIN_SECRET });
    }
    return res.status(401).json({ error: '비밀번호가 틀렸습니다.' });
}
