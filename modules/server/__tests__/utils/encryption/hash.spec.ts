import { Hash } from '@/utils';

describe('Hash', () => {
  let hash: Hash;

  beforeEach(() => {
    hash = new Hash('sha256', 'test-salt');
  });

  it('hashPassword returns a hex string', async () => {
    const result = await hash.hashPassword('password123');
    expect(typeof result).toBe('string');
    expect(result).toMatch(/^[a-f0-9]+$/);
  });

  it('generateSalt returns a string of default length 16', async () => {
    const salt = await hash.generateSalt();
    expect(typeof salt).toBe('string');
    expect(salt).toHaveLength(16);
  });

  it('generateSalt returns a string of the specified length', async () => {
    const salt = await hash.generateSalt(8);
    expect(salt).toHaveLength(8);
  });
});
