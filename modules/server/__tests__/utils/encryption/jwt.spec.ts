import { JWTToken } from '@/utils/encryption/jwt';

describe('JWTToken', () => {
  let jwt: JWTToken;

  beforeEach(() => {
    jwt = new JWTToken();
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
});
