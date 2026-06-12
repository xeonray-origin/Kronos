import { IHash, HashAlgorithm } from '@/interfaces';
import { createHash, createHmac } from 'node:crypto';

export class Hash implements IHash {
  constructor(
    protected algorithm: HashAlgorithm,
    protected saltLength = 16,
  ) {}

  public async generateSalt(length = this.saltLength): Promise<string> {
    const salt = createHash(this.algorithm);
    salt.update(Date.now().toString());
    const generatedSalt = salt.digest('hex').slice(0, length);
    return generatedSalt;
  }

  public async hashPassword(password: string): Promise<{ password: string; salt: string }> {
    const salt = await this.generateSalt(this.saltLength);
    const hash = createHmac(this.algorithm, salt);
    hash.update(password);
    const hashedPassword = hash.digest('hex');
    return { password: hashedPassword, salt: salt };
  }
}
