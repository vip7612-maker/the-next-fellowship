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
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        if (!requireAdmin(req, res)) return;
        try {
            const { surveyId } = req.query;
            if (surveyId && typeof surveyId === 'string') {
                const { rows } = await db.execute({
                    sql: 'SELECT * FROM mentor_survey_responses WHERE surveyId = ? ORDER BY createdAt DESC',
                    args: [surveyId]
                });
                return res.status(200).json(rows);
            }
            const { rows } = await db.execute('SELECT * FROM mentor_survey_responses ORDER BY createdAt DESC');
            return res.status(200).json(rows);
        } catch (error) {
            console.error('[mentorResponses GET]', error);
            return res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
        }
    }

    if (req.method === 'POST') {
        try {
            const {
                surveyId, name, phone, email, university, grade, major,
                attendance, transport, motivation, shareStory, experience,
                consentPersonal, consentImage
            } = req.body;

            if (!surveyId || !name || !phone || !email || !university || !grade || !major
                || !attendance || !motivation || !shareStory) {
                return res.status(400).json({ error: '필수 항목이 누락되었습니다.' });
            }
            if (!isValidPhone(phone)) {
                return res.status(400).json({ error: '유효한 전화번호 형식이 아닙니다.' });
            }
            if (!isValidEmail(email)) {
                return res.status(400).json({ error: '유효한 이메일 형식이 아닙니다.' });
            }
            if (!consentPersonal) {
                return res.status(400).json({ error: '개인정보 수집·이용 동의(필수)가 필요합니다.' });
            }

            // 설문이 활성 상태인지 확인
            const { rows: surveyRows } = await db.execute({
                sql: 'SELECT id, round, title, isActive FROM mentor_surveys WHERE id = ?',
                args: [surveyId]
            });
            if (surveyRows.length === 0) {
                return res.status(404).json({ error: '설문을 찾을 수 없습니다.' });
            }
            const survey = surveyRows[0] as Record<string, unknown>;
            if (Number(survey.isActive) !== 1) {
                return res.status(403).json({ error: '현재 접수가 마감된 설문입니다.' });
            }

            const id = crypto.randomUUID();
            const createdAt = new Date().toISOString();

            await db.execute({
                sql: `INSERT INTO mentor_survey_responses
                      (id, surveyId, name, phone, email, university, grade, major,
                       attendance, transport, motivation, shareStory, experience,
                       consentPersonal, consentImage, createdAt)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [
                    id, surveyId, name, phone, email, university, grade, major,
                    attendance, transport || '', motivation, shareStory, experience || '',
                    consentPersonal ? 1 : 0, consentImage ? 1 : 0, createdAt
                ]
            });

            // Telegram 알림 (선택적)
            try {
                const botToken = process.env.TELEGRAM_BOT_TOKEN;
                const chatId = process.env.TELEGRAM_CHAT_ID;
                if (botToken && chatId) {
                    const message =
                        `📋 새로운 멘토 신청이 접수되었습니다 \\[${escapeTg(String(survey.round))}회차\\]\n\n` +
                        `👤 이름: ${escapeTg(name)}\n` +
                        `🎓 소속: ${escapeTg(university)} ${escapeTg(grade)}\n` +
                        `📚 전공: ${escapeTg(major)}\n` +
                        `📱 연락처: ${escapeTg(phone)}\n` +
                        `✉️ 이메일: ${escapeTg(email)}\n` +
                        `🚗 참석 가능: ${escapeTg(attendance)}\n\n` +
                        `\\[지원 동기\\]\n${escapeTg(motivation)}\n\n` +
                        `\\[나누고 싶은 이야기\\]\n${escapeTg(shareStory)}`;
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
            console.error('[mentorResponses POST]', error);
            return res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
        }
    }

    if (req.method === 'DELETE') {
        if (!requireAdmin(req, res)) return;
        try {
            const { id } = req.query;
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: 'id는 필수입니다.' });
            }
            await db.execute({ sql: 'DELETE FROM mentor_survey_responses WHERE id = ?', args: [id] });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('[mentorResponses DELETE]', error);
            return res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
