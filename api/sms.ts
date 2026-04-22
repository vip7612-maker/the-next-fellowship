import { SolapiMessageService } from 'solapi';
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!requireAdmin(req, res)) return;

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { messages } = req.body; // Array of { to: '01012345678', text: '내용' }

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ success: false, error: 'No messages provided' });
        }

        const senderNumber = process.env.SOLAPI_SENDER_NUMBER as string;

        if (!senderNumber) {
            throw new Error('SOLAPI_SENDER_NUMBER is not set in environment variables');
        }

        // Apply server-side sender number
        const formattedMessages = messages.map((m: any) => ({
            ...m,
            from: senderNumber,
        }));

        const result = await messageService.send(formattedMessages);
        return res.status(200).json({ success: true, count: formattedMessages.length, result });
    } catch (error: any) {
        console.error('SMS Send Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
