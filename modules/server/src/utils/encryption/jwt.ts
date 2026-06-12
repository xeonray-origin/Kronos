import { IJwtToken } from '@/interfaces';
import crypto from 'crypto';

export class JWTToken implements IJwtToken {
  secretKey: string;
  constructor() {
    this.secretKey = process.env.JWT_SECRET || 'your_super_secret_key';
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

  public async generateToken(payload: Record<string, any>) {
    const header = { alg: 'HS256', typ: 'JWT' };

    const tokenPayload = {
      ...payload,
      exp: payload.exp || Math.floor(Date.now() / 1000) + 3600,
    };

    const encodedHeader = await this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = await this.base64UrlEncode(JSON.stringify(tokenPayload));

    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const encodedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(signatureInput)
      .digest('base64url');

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  }

  public async verifyToken(token: string) {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts as [string, string, string];

    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const encodedExpectedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(signatureInput)
      .digest('base64url');

    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(encodedSignature),
      Buffer.from(encodedExpectedSignature),
    );

    if (!isSignatureValid) return null;

    const payload = JSON.parse(await this.base64UrlDecode(encodedPayload));

    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null;
    }

    return payload;
  }
}
