import { createClient } from '@libsql/client/http';

const db = createClient({
    url: process.env.TURSO_DATABASE_URL as string,
    authToken: process.env.TURSO_AUTH_TOKEN as string,
});

export default async function handler(req: any, res: any) {
    if (req.method === 'GET') {
        try {
            const { rows } = await db.execute('SELECT * FROM applicants ORDER BY date DESC');
            return res.status(200).json(rows);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'POST') {
        try {
            const { id, name, school, phone, email, careerReason, motivation, questionForYoon, status, date, role } = req.body;
            await db.execute({
                sql: `INSERT INTO applicants (id, name, school, phone, email, careerReason, motivation, questionForYoon, status, date, role)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [id, name, school, phone, email, careerReason, motivation, questionForYoon, status || 'Pending', date, role || '학생']
            });

            // Telegram Notification
            try {
                const botToken = process.env.TELEGRAM_BOT_TOKEN;
                const chatId = process.env.TELEGRAM_CHAT_ID;
                if (botToken && chatId) {
                    const message = `🔔 새로운 신청자가 등록되었습니다!\n\n` +
                        `👤 이름: ${name}\n` +
                        `🏫 소속: ${school || '미입력'}\n` +
                        `📱 연락처: ${phone}\n` +
                        `✉️ 이메일: ${email || '미입력'}\n` +
                        `🏷️ 유형: ${role || '학생'}\n\n` +
                        `[진로 희망 이유]\n${careerReason}\n\n` +
                        `[지원 동기]\n${motivation}\n\n` +
                        `[윤여정 선생님께 질문]\n${questionForYoon}`;
                    
                    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: message
                        })
                    });
                }
            } catch (tgError) {
                console.error('Telegram notification failed:', tgError);
                // 알림이 실패하더라도 신청 결과에는 영향을 주지 않음
            }

            return res.status(200).json({ success: true });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { id, status } = req.body;
            await db.execute({
                sql: `UPDATE applicants SET status = ? WHERE id = ?`,
                args: [status, id]
            });
            return res.status(200).json({ success: true });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
