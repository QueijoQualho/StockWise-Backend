import jwt from 'jsonwebtoken';

export class JwtService {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  generateToken(payload: any, expiresIn = '3h'): string {
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }

  verifyToken(token: string): any {
    return jwt.verify(token, this.secretKey);
  }
}
