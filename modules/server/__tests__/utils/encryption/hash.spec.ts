import { Hash } from '@/utils';

describe('Hash', () => {
  let hash: Hash;

  beforeEach(() => {
    hash = new Hash('sha256');
  });

  describe('generateSalt', () => {
    it('returns a hex string of the default length (16)', async () => {
      const salt = await hash.generateSalt();
      expect(salt).toMatch(/^[a-f0-9]+$/);
      expect(salt).toHaveLength(16);
    });

    it('returns a hex string of the specified length', async () => {
      const salt = await hash.generateSalt(8);
      expect(salt).toMatch(/^[a-f0-9]+$/);
      expect(salt).toHaveLength(8);
    });

    it('returns different salts on successive calls', async () => {
      const salt1 = await hash.generateSalt();
      await new Promise((r) => setTimeout(r, 5));
      const salt2 = await hash.generateSalt();
      expect(salt1).not.toBe(salt2);
    });
  });

  describe('hashPassword', () => {
    it('returns an object with password and salt fields', async () => {
      const result = await hash.hashPassword('secret');
      expect(result).toHaveProperty('password');
      expect(result).toHaveProperty('salt');
    });

    it('returns hex strings for both password and salt', async () => {
      const { password, salt } = await hash.hashPassword('secret');
      expect(password).toMatch(/^[a-f0-9]+$/);
      expect(salt).toMatch(/^[a-f0-9]+$/);
    });

    it('salt length matches the configured saltLength', async () => {
      const { salt } = await hash.hashPassword('secret');
      expect(salt).toHaveLength(16);
    });

    it('produces different hashes for different passwords', async () => {
      const result1 = await hash.hashPassword('password1');
      const result2 = await hash.hashPassword('password2');
      expect(result1.password).not.toBe(result2.password);
    });

    it('respects a custom saltLength set in the constructor', async () => {
      const customHash = new Hash('sha256', 8);
      const { salt } = await customHash.hashPassword('secret');
      expect(salt).toHaveLength(8);
    });
  });

  describe('verifyPassword', () => {
    it('returns true when the password matches the stored hash', async () => {
      const { password: storedHash, salt } = await hash.hashPassword('secret');
      const result = await hash.verifyPassword('secret', salt, storedHash);
      expect(result).toBe(true);
    });

    it('returns false when the password does not match the stored hash', async () => {
      const { password: storedHash, salt } = await hash.hashPassword('secret');
      const result = await hash.verifyPassword('wrong', salt, storedHash);
      expect(result).toBe(false);
    });
  });
});
