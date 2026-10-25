import { IHash, HashAlgorithm } from '@/interfaces';
import { createHmac } from 'node:crypto';

export class Hash implements IHash {
  constructor(protected algorithm: HashAlgorithm) {}

  public async verifyPassword(
    password: string,
    salt: string,
    storedHash: string,
  ): Promise<boolean> {
    const hash = createHmac(this.algorithm, salt);
    hash.update(password);
    return hash.digest('hex') === storedHash;
  }
}
