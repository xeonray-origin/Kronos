export interface IHash {
  hashPassword(password: string): Promise<{ password: string; salt: string }>;
  generateSalt(length?: number): Promise<string>;
}

export type HashAlgorithm = 'sha256';

export type JwtTokenPayload = {
  exp: number;
  [key: string]: string | number | undefined;
};

export interface IJwtToken {
  base64UrlEncode: (payload: string) => Promise<string>;
  base64UrlDecode: (payload: string) => Promise<string>;
  generateToken: (payload: JwtTokenPayload) => Promise<string>;
  verifyToken: (token: string) => Promise<JwtTokenPayload | null>;
}
