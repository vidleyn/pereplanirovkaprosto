import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'U3VwZXJTZWNyZXRLZXlGb3JKV1RHZW5lcmF0aW9uSW5TcHJpbmdCb290QXBwbGljYXRpb24=';
const EXPIRATION = parseInt(process.env.JWT_EXPIRATION || '86400000');

export class JwtService {
  static generateToken(user) {
    const payload = {
      username: user.username,
      role: user.role
    };

    return jwt.sign(payload, SECRET_KEY, {
      expiresIn: EXPIRATION / 1000, // конвертируем миллисекунды в секунды
      algorithm: 'HS256'
    });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token format');
      }
      throw error;
    }
  }

  static extractUsername(token) {
    const decoded = this.verifyToken(token);
    return decoded.username;
  }

  static isTokenValid(token, user) {
    try {
      const decoded = this.verifyToken(token);
      return decoded.username === user.username;
    } catch (error) {
      return false;
    }
  }
}

