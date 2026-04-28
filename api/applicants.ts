import { createClient } from '@libsql/client/http';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const requireAdmin = (req: VercelRequest, res: VercelResponse): boolean => {
    const auth = req.headers.authorization;
    if (!auth || auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
        res.status(401).json({ error: '인증이 필요합니다.' });
        return false;
    }
    return true;
};

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
            const {
                name, school, phone, email, careerReason, motivation, questionForYoon, role,
                transcriptFileName, transcriptMimeType, transcriptDataUrl, transcriptSizeBytes
            } = req.body;

            if (!name || !phone || !careerReason || !motivation || !questionForYoon) {
                return res.status(400).json({ error: '필수 항목(이름, 연락처, 진로이유, 지원동기, 질문)을 모두 입력해주세요.' });
            }
            if (!isValidPhone(phone)) {
                return res.status(400).json({ error: '유효한 전화번호 형식이 아닙니다.' });
            }

            // 생기부 파일 검증 (선택)
            let txFileName: string | null = null;
            let txMimeType: string | null = null;
            let txDataUrl: string | null = null;
            let txSize: number | null = null;
            if (transcriptDataUrl) {
                if (typeof transcriptDataUrl !== 'string' || !transcriptDataUrl.startsWith('data:')) {
                    return res.status(400).json({ error: '첨부 파일 형식이 올바르지 않습니다.' });
                }
                if (transcriptDataUrl.length > 4 * 1024 * 1024) {
                    return res.status(413).json({ error: '첨부 파일이 너무 큽니다. 3MB 이하로 줄여주세요.' });
                }
                txFileName = transcriptFileName || '생기부';
                txMimeType = transcriptMimeType || 'application/octet-stream';
                txDataUrl = transcriptDataUrl;
                txSize = typeof transcriptSizeBytes === 'number' ? transcriptSizeBytes : null;
            }

            const id = crypto.randomUUID();
            const date = new Date().toISOString().split('T')[0];

            await db.execute({
                sql: `INSERT INTO applicants (id, name, school, phone, email, careerReason, motivation, questionForYoon, status, date, role, transcriptFileName, transcriptMimeType, transcriptDataUrl, transcriptSizeBytes)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [id, name, school, phone, email, careerReason, motivation, questionForYoon, 'Pending', date, role || '학생',
                    txFileName, txMimeType, txDataUrl, txSize]
            });

            try {
                const botToken = process.env.TELEGRAM_BOT_TOKEN;
                const chatId = process.env.TELEGRAM_CHAT_ID;
                if (botToken && chatId) {
                    const transcriptLine = txFileName
                        ? `\n📎 생기부 첨부: ${escapeTg(txFileName)} (${escapeTg(((txSize || 0) / 1024).toFixed(0))}KB)`
                        : '';
                    const message =
                        `🔔 새로운 신청자가 등록되었습니다\\! \\[2회차\\]\n\n` +
                        `👤 이름: ${escapeTg(name)}\n` +
                        `🏫 소속: ${escapeTg(school || '미입력')}\n` +
                        `📱 연락처: ${escapeTg(phone)}\n` +
                        `✉️ 이메일: ${escapeTg(email || '미입력')}\n` +
                        `🏷️ 유형: ${escapeTg(role || '학생')}` +
                        transcriptLine + `\n\n` +
                        `\\[진로 희망 이유\\]\n${escapeTg(careerReason)}\n\n` +
                        `\\[지원 동기\\]\n${escapeTg(motivation)}\n\n` +
                        `\\[이상연 소장님께 질문\\]\n${escapeTg(questionForYoon)}`;

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
