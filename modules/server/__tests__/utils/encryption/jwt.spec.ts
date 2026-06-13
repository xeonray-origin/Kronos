import { JWTToken } from '@/utils';

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
});
