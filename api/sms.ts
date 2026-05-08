import { SolapiMessageService } from 'solapi';
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

const messageService = new SolapiMessageService(
    process.env.SOLAPI_API_KEY as string,
    process.env.SOLAPI_API_SECRET as string
);

const db = createClient({
    url: process.env.TURSO_DATABASE_URL as string,
    authToken: process.env.TURSO_AUTH_TOKEN as string,
});

const getByteLength = (str: string) => {
    let b = 0;
    for (let i = 0; i < str.length; i++) {
        b += str.charCodeAt(i) <= 0x7F ? 1 : 2;
    }
    return b;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!requireAdmin(req, res)) return;

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { messages, meta } = req.body as {
            messages: { to: string; text: string; name?: string }[];
            meta?: { templateId?: string; title?: string; targetType?: string; content?: string };
        };

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ success: false, error: 'No messages provided' });
        }

        const senderNumber = process.env.SOLAPI_SENDER_NUMBER as string;
        if (!senderNumber) {
            throw new Error('SOLAPI_SENDER_NUMBER is not set in environment variables');
        }

        const formattedMessages = messages.map((m) => ({
            to: m.to,
            text: m.text,
            from: senderNumber,
        }));

        const result: any = await messageService.send(formattedMessages);

        // 발송 이력 기록
        const logId = crypto.randomUUID();
        const now = new Date().toISOString();
        const groupId = result?.groupInfo?.groupId || null;
        const successCount = result?.groupInfo?.count?.registeredSuccess ?? formattedMessages.length;
        const failCount = result?.groupInfo?.count?.registeredFailed ?? 0;
        const sampleText = meta?.content || messages[0]?.text || '';
        const isLms = getByteLength(sampleText) > 90 ? 1 : 0;

        try {
            await db.execute({
                sql: `INSERT INTO sms_send_logs (id, groupId, templateId, title, content, targetType, targetCount, successCount, failCount, isLms, sentAt, rawResult)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [
                    logId,
                    groupId,
                    meta?.templateId || null,
                    meta?.title || '',
                    sampleText,
                    meta?.targetType || 'custom',
                    formattedMessages.length,
                    successCount,
                    failCount,
                    isLms,
                    now,
                    JSON.stringify(result).slice(0, 4000)
                ]
            });

            // 수신자별 기록 (배치)
            const failedSet = new Set(
                (result?.failedMessageList || []).map((f: any) => String(f.to || '').replace(/[^0-9]/g, ''))
            );
            for (const m of messages) {
                const cleanPhone = String(m.to).replace(/[^0-9]/g, '');
                const status = failedSet.has(cleanPhone) ? 'failed' : 'success';
                await db.execute({
                    sql: 'INSERT INTO sms_send_recipients (id, sendLogId, name, phone, status, errorMessage) VALUES (?, ?, ?, ?, ?, ?)',
                    args: [crypto.randomUUID(), logId, m.name || null, cleanPhone, status, null]
                });
            }
        } catch (logErr) {
            console.error('[sms log save]', logErr);
        }

        return res.status(200).json({
            success: true,
            count: formattedMessages.length,
            successCount,
            failCount,
            groupId,
            logId,
            result
        });
    } catch (error: any) {
        console.error('SMS Send Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
