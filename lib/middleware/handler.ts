import { createRouter, expressWrapper } from 'next-connect';
import { apiRateLimiter } from '@/lib/middleware/rateLimit';
import { csrfProtection, attachCsrfToken } from '@/lib/middleware/csrf';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Helper to create a Next.js API route with built‑in rate limiting and CSRF protection.
 * Usage:
 *   const handler = createHandler();
 *   handler.get(async (req, res) => { ... });
 */
export function createHandler() {
    const router = createRouter<NextApiRequest, NextApiResponse>();
    return router
        .use(expressWrapper(apiRateLimiter as any))
        .use(expressWrapper(csrfProtection as any))
        .use(expressWrapper(attachCsrfToken as any))
        .handler({
            onError(error, req, res) {
                console.error('API error:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            },
            onNoMatch(req, res) {
                res.status(405).json({ error: `Method ${req.method} Not Allowed` });
            },
        });
}
