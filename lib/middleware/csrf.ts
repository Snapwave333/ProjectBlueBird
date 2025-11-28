import csrf from 'csurf';
import { Request, Response, NextFunction } from 'express';

/**
 * CSRF protection middleware for Next.js API routes.
 * Uses double‑submit cookie strategy.
 */
export const csrfProtection = csrf({
    cookie: true,
});

// Helper to attach a CSRF token to the response (for GET requests)
export function attachCsrfToken(req: Request, res: Response, next: NextFunction) {
    // csurf adds req.csrfToken() method
    const token = (req as any).csrfToken?.();
    if (token) {
        res.setHeader('X-CSRF-Token', token);
    }
    next();
}
