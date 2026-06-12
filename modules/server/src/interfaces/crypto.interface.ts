export interface HashInterface {
  hashPassword(password: string): Promise<{ password: string; salt: string }>;
  generateSalt(length?: number): Promise<string>;
}

export type HashAlgorithm = 'sha256';
