import { IPasswordHasher } from '@/interfaces';
import { hash, verify } from '@node-rs/argon2';

export class Argon2Hash implements IPasswordHasher {
  public async hash(password: string): Promise<string> {
    return hash(password);
  }

  public async verify(storedHash: string, password: string): Promise<boolean> {
    return verify(storedHash, password);
  }

  public isCurrentFormat(storedHash: string): boolean {
    return storedHash.startsWith('$argon2');
  }
}
