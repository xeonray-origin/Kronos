import crypto from 'crypto';
import { appConfig } from '@/config';
import { JWTToken } from '@/utils';

const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');

const forge = (header: object, payload: object, secret: string) => {
  const body = `${encode(header)}.${encode(payload)}`;
  return `${body}.${crypto.createHmac('sha256', secret).update(body).digest('base64url')}`;
};

describe('JWTToken', () => {
  let jwt: JWTToken;

  beforeEach(() => {
    jwt = new JWTToken();
  });

  describe('base64UrlDecode', () => {
    it('adds padding when the base64url string length is not a multiple of 4', async () => {
      expect(await jwt.base64UrlDecode('YQ')).toBe('a');
    });
  });

  describe('generateToken', () => {
    it('uses provided exp', async () => {
      const exp = Math.floor(Date.now() / 1000) + 7200;
      const token = await jwt.generateToken({ exp });
      expect(token.split('.')).toHaveLength(3);
    });

    it('auto-generates exp when not provided', async () => {
      const token = await jwt.generateToken({} as any);
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('verifyToken', () => {
    it('returns null for malformed token', async () => {
      expect(await jwt.verifyToken('not.a.valid.jwt.string')).toBeNull();
    });

    it('returns null for tampered signature', async () => {
      const token = await jwt.generateToken({ exp: Math.floor(Date.now() / 1000) + 3600 });
      const [header, payload, signature] = token.split('.') as [string, string, string];
      expect(
        await jwt.verifyToken(`${header}.${payload}.${signature.split('').reverse().join('')}`),
      ).toBeNull();
    });

    it('returns null for expired token', async () => {
      const token = await jwt.generateToken({ exp: 1 });
      expect(await jwt.verifyToken(token)).toBeNull();
    });

    it('returns payload for valid token', async () => {
      const exp = Math.floor(Date.now() / 1000) + 3600;
      const token = await jwt.generateToken({ exp, userId: 'abc' });
      expect(await jwt.verifyToken(token)).toMatchObject({ exp, userId: 'abc' });
    });
  });

  describe('generateRefreshToken / verifyRefreshToken', () => {
    it('generates a valid 3-part refresh token', async () => {
      const token = await jwt.generateRefreshToken({ exp: Math.floor(Date.now() / 1000) + 86400 });
      expect(token.split('.')).toHaveLength(3);
    });

    it('returns payload for a valid refresh token', async () => {
      const exp = Math.floor(Date.now() / 1000) + 86400;
      const token = await jwt.generateRefreshToken({ exp, userId: 'xyz' });
      expect(await jwt.verifyRefreshToken(token)).toMatchObject({ exp, userId: 'xyz' });
    });

    it('returns null for an expired refresh token', async () => {
      const token = await jwt.generateRefreshToken({ exp: 1 });
      expect(await jwt.verifyRefreshToken(token)).toBeNull();
    });

    it('returns null when verified with the wrong secret (access token verifier)', async () => {
      const token = await jwt.generateRefreshToken({ exp: Math.floor(Date.now() / 1000) + 86400 });
      expect(await jwt.verifyToken(token)).toBeNull();
    });
  });

  describe('rejection rules', () => {
    const future = () => Math.floor(Date.now() / 1000) + 3600;
    const hs256 = { alg: 'HS256', typ: 'JWT' };

    it('rejects a tampered payload that keeps the original signature', async () => {
      const token = await jwt.generateToken({ exp: future(), role: 'user' });
      const [header, , signature] = token.split('.') as [string, string, string];
      const forged = `${header}.${encode({ exp: future(), role: 'admin' })}.${signature}`;
      expect(await jwt.verifyToken(forged)).toBeNull();
    });

    it('rejects a validly signed token whose alg is not HS256', async () => {
      const token = forge({ alg: 'none', typ: 'JWT' }, { exp: future() }, appConfig.jwtSecret);
      expect(await jwt.verifyToken(token)).toBeNull();
      const hs512 = forge({ alg: 'HS512', typ: 'JWT' }, { exp: future() }, appConfig.jwtSecret);
      expect(await jwt.verifyToken(hs512)).toBeNull();
    });

    it('rejects a validly signed token with no exp', async () => {
      expect(await jwt.verifyToken(forge(hs256, { userId: 'a' }, appConfig.jwtSecret))).toBeNull();
    });

    it('rejects a validly signed token with a non-numeric exp', async () => {
      expect(await jwt.verifyToken(forge(hs256, { exp: 'never' }, appConfig.jwtSecret))).toBeNull();
    });

    it('rejects an expired token', async () => {
      const token = forge(hs256, { exp: Math.floor(Date.now() / 1000) - 10 }, appConfig.jwtSecret);
      expect(await jwt.verifyToken(token)).toBeNull();
    });

    it('rejects a signature of the wrong length without throwing', async () => {
      const [header, payload] = (await jwt.generateToken({ exp: future() })).split('.') as [
        string,
        string,
      ];
      expect(await jwt.verifyToken(`${header}.${payload}.abc`)).toBeNull();
    });

    it('rejects a validly signed token with unparseable JSON', async () => {
      const body = `${Buffer.from('{').toString('base64url')}.${encode({ exp: future() })}`;
      const signature = crypto
        .createHmac('sha256', appConfig.jwtSecret)
        .update(body)
        .digest('base64url');
      expect(await jwt.verifyToken(`${body}.${signature}`)).toBeNull();
    });

    it('does not let the access and refresh secrets verify each other', async () => {
      expect(appConfig.jwtSecret).not.toBe(appConfig.jwtRefreshSecret);
      const access = await jwt.generateToken({ exp: future() });
      const refresh = await jwt.generateRefreshToken({ exp: future() });
      expect(await jwt.verifyRefreshToken(access)).toBeNull();
      expect(await jwt.verifyToken(refresh)).toBeNull();
    });
  });
});
