import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 10 * 1024 * 1024;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end();
    }

    try {
        const body = req.body as HandleUploadBody;
        const json = await handleUpload({
            request: req as unknown as Request,
            body,
            onBeforeGenerateToken: async () => ({
                allowedContentTypes: ALLOWED,
                maximumSizeInBytes: MAX_BYTES,
                addRandomSuffix: true,
            }),
        });
        return res.status(200).json(json);
    } catch (error) {
        console.error('[blob-upload]', error);
        return res.status(400).json({ error: error instanceof Error ? error.message : '업로드 토큰 발급 실패' });
    }
}
