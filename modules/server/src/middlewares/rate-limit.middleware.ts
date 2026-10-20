import rateLimit from 'express-rate-limit';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

export const authRateLimiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: MAX_ATTEMPTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts, try again later' },
});
