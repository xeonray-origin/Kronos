import { Argon2Hash } from '@/utils';

describe('Argon2Hash', () => {
  const hasher = new Argon2Hash();

  it('produces an argon2id hash that verifies against the original password', async () => {
    const storedHash = await hasher.hash('password123');

    expect(storedHash).toMatch(/^\$argon2id\$/);
    await expect(hasher.verify(storedHash, 'password123')).resolves.toBe(true);
  });

  it('rejects a wrong password', async () => {
    const storedHash = await hasher.hash('password123');

    await expect(hasher.verify(storedHash, 'wrong-password')).resolves.toBe(false);
  });

  describe('isCurrentFormat', () => {
    it('returns true for an argon2 hash', () => {
      expect(hasher.isCurrentFormat('$argon2id$v=19$m=19456,t=2,p=1$c2FsdA$aGFzaA')).toBe(true);
    });

    it('returns false for a legacy SHA-256 hex hash', () => {
      expect(hasher.isCurrentFormat('a'.repeat(64))).toBe(false);
    });
  });
});
