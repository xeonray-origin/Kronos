import express from 'express';
import helmet from 'helmet';
import { AddressInfo } from 'net';
import { Server } from 'http';
import { authRateLimiter } from '@/middlewares/rate-limit.middleware';

describe('authRateLimiter', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    const app = express();
    app.use(helmet());
    app.post('/login', authRateLimiter, (_req, res) => {
      res.status(200).json({ ok: true });
    });
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => resolve());
    });
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('allows 10 attempts and rejects the 11th with 429', async () => {
    for (let attempt = 1; attempt <= 10; attempt++) {
      const response = await fetch(`${baseUrl}/login`, { method: 'POST' });
      expect(response.status).toBe(200);
    }

    const blocked = await fetch(`${baseUrl}/login`, { method: 'POST' });

    expect(blocked.status).toBe(429);
    expect(await blocked.json()).toEqual({ error: 'Too many attempts, try again later' });
    expect(blocked.headers.get('retry-after')).not.toBeNull();
  });

  it('serves helmet security headers', async () => {
    const response = await fetch(`${baseUrl}/login`, { method: 'POST' });

    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(response.headers.get('x-powered-by')).toBeNull();
  });
});
