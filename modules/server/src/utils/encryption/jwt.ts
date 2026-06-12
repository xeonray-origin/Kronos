import { IJwtToken, JwtTokenPayload } from '@/interfaces';
import crypto from 'crypto';

export class JWTToken implements IJwtToken {
  secretKey: string;
  refreshSecretKey: string;
  constructor() {
    this.secretKey = process.env.JWT_SECRET || 'your_super_secret_key';
    this.refreshSecretKey = process.env.JWT_REFRESH_SECRET || 'your_super_refresh_secret_key';
  }
  public async base64UrlEncode(payload: string) {
    return Buffer.from(payload)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  public async base64UrlDecode(payload: string) {
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return Buffer.from(base64, 'base64').toString('utf8');
  }

  public async generateToken(payload: Record<string, any>): Promise<string> {
    return this.sign(payload, this.secretKey, Math.floor(Date.now() / 1000) + 3600);
  }

  public async generateRefreshToken(payload: Record<string, any>): Promise<string> {
    return this.sign(
      payload,
      this.refreshSecretKey,
      Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    );
  }

  private async sign(
    payload: Record<string, any>,
    secret: string,
    defaultExp: number,
  ): Promise<string> {
    const header = { alg: 'HS256', typ: 'JWT' };
    const tokenPayload = { ...payload, exp: payload.exp || defaultExp };
    const encodedHeader = await this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = await this.base64UrlEncode(JSON.stringify(tokenPayload));
    const encodedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  }

  private async verify(token: string, secret: string): Promise<JwtTokenPayload | null> {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [encodedHeader, encodedPayload, encodedSignature] = parts as [string, string, string];
    const encodedExpectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');
    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(encodedSignature),
      Buffer.from(encodedExpectedSignature),
    );
    if (!isSignatureValid) return null;
    const payload = JSON.parse(await this.base64UrlDecode(encodedPayload));
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return payload;
  }

  public async verifyToken(token: string): Promise<JwtTokenPayload | null> {
    return this.verify(token, this.secretKey);
  }

  public async verifyRefreshToken(token: string): Promise<JwtTokenPayload | null> {
    return this.verify(token, this.refreshSecretKey);
  }
}
