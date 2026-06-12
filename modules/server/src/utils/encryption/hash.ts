import { HashInterface, HashAlgorithm } from '@/interfaces';
const { createHash } = require('node:crypto');

export class Hash implements HashInterface {
  constructor(
    protected algorithm: HashAlgorithm,
    protected salt: string,
  ) {}
  public async hashPassword(password: string): Promise<{ password: string }> {
    const hash = await createHash(this.algorithm);
    await hash.update(password);
    const hashedPassword = await hash.digest('hex');
    return hashedPassword;
  }

  public async generateSalt(length: number = 16): Promise<string> {
    const salt = await createHash(this.algorithm);
    await salt.update(Date.now().toString());
    const generatedSalt = await salt.digest('hex').slice(0, length);
    return generatedSalt;
  }
}
