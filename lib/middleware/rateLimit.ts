import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

/**
 * Rate limiting middleware for Next.js API routes.
 * Limits each IP to 60 requests per minute with a burst of 120.
 */
export const apiRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        res.status(429).json({ error: 'Too many requests, please try again later.' });
    },
});
