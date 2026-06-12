export interface HashInterface {
  hashPassword(password: string): Promise<{ password: string }>;
}

export type HashAlgorithm = 'sha256' | 'sha512' | 'sha1' | 'md5';
