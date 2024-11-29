import { JwtService } from '@service/auth/jwtService';
import { Request, Response, NextFunction } from 'express';
import { isPublicRoute } from './isPublicRoute';

export class JwtAuthGuard {

  constructor(private readonly jwtService: JwtService) { }

  canActivate() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (isPublicRoute(req)) {
        return next();
      }

      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token de autorização não fornecido' });
      }

      const token = authHeader.split(' ')[1];

      try {
        const decoded = this.jwtService.verifyToken(token);
        req.user = decoded;
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
