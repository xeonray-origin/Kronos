import { Hash } from '@/utils';
import { createHmac } from 'node:crypto';

describe('Hash', () => {
  const hash = new Hash('sha256');
  const salt = 'salt_abc';
  const storedHash = createHmac('sha256', salt).update('secret').digest('hex');

  describe('verifyPassword', () => {
    it('returns true when the password matches the stored hash', async () => {
      await expect(hash.verifyPassword('secret', salt, storedHash)).resolves.toBe(true);
    });

    it('returns false when the password does not match the stored hash', async () => {
      await expect(hash.verifyPassword('wrong', salt, storedHash)).resolves.toBe(false);
    });

    it('returns false when the salt does not match', async () => {
      await expect(hash.verifyPassword('secret', 'other_salt', storedHash)).resolves.toBe(false);
    });
  });
});
