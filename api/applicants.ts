import { createClient } from '@libsql/client/http';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdmin } from './_requireAdmin';

const db = createClient({
    url: process.env.TURSO_DATABASE_URL as string,
    authToken: process.env.TURSO_AUTH_TOKEN as string,
});

const escapeTg = (text: string) =>
    String(text).replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');

const isValidPhone = (phone: string) => /^\d{9,11}$/.test(phone.replace(/[^0-9]/g, ''));

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        if (!requireAdmin(req, res)) return;
        try {
            const { rows } = await db.execute('SELECT * FROM applicants ORDER BY date DESC');
            return res.status(200).json(rows);
        } catch (error) {
            console.error('[applicants GET]', error);
            return res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { name, school, phone, email, careerReason, motivation, questionForYoon, role } = req.body;

            if (!name || !phone || !careerReason || !motivation || !questionForYoon) {
                return res.status(400).json({ error: '필수 항목(이름, 연락처, 진로이유, 지원동기, 질문)을 모두 입력해주세요.' });
            }
            if (!isValidPhone(phone)) {
                return res.status(400).json({ error: '유효한 전화번호 형식이 아닙니다.' });
            }

            const id = crypto.randomUUID();
            const date = new Date().toISOString().split('T')[0];

            await db.execute({
                sql: `INSERT INTO applicants (id, name, school, phone, email, careerReason, motivation, questionForYoon, status, date, role, round)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [id, name, school, phone, email, careerReason, motivation, questionForYoon, 'Pending', date, role || '학생', 2]
            });

            try {
                const botToken = process.env.TELEGRAM_BOT_TOKEN;
                const chatId = process.env.TELEGRAM_CHAT_ID;
                if (botToken && chatId) {
                    const message =
                        `🔔 새로운 신청자가 등록되었습니다\\! \\[2회차\\]\n\n` +
                        `👤 이름: ${escapeTg(name)}\n` +
                        `🏫 소속: ${escapeTg(school || '미입력')}\n` +
                        `📱 연락처: ${escapeTg(phone)}\n` +
                        `✉️ 이메일: ${escapeTg(email || '미입력')}\n` +
                        `🏷️ 유형: ${escapeTg(role || '학생')}\n\n` +
                        `\\[진로 희망 이유\\]\n${escapeTg(careerReason)}\n\n` +
                        `\\[지원 동기\\]\n${escapeTg(motivation)}\n\n` +
                        `\\[윤여정 선생님께 질문\\]\n${escapeTg(questionForYoon)}`;

                    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'MarkdownV2' })
                    });
                }
            } catch (tgError) {
                console.error('Telegram notification failed:', tgError);
            }

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('[applicants POST]', error);
            return res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
        }
    }

    if (req.method === 'PUT') {
        if (!requireAdmin(req, res)) return;
        try {
            const { id, status } = req.body;
            if (!id || !status) {
                return res.status(400).json({ error: 'id와 status는 필수입니다.' });
            }
            await db.execute({
                sql: `UPDATE applicants SET status = ? WHERE id = ?`,
                args: [status, id]
            });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('[applicants PUT]', error);
            return res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
