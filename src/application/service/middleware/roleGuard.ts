import { UserPayload } from '@service/auth/strategies/jwtAuthStrategy';
import { ForbiddenError, UnauthorizedError } from '@utils/errors';
import { forbidden, unauthorized } from '@utils/errors/httpErrors';
import { Request, Response, NextFunction } from 'express';

export class RoleGuard {
  private requiredRole: string;

  constructor(requiredRole: string) {
    this.requiredRole = requiredRole;
  }

  checkRole() {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = req.user as UserPayload;

      if (!user) {
        return unauthorized(res, new UnauthorizedError("User not authenticate"));
      }

      if (user.role !== this.requiredRole) {
        return forbidden(res, new ForbiddenError("Acess denied"));
      }

      next();
    };
  }
}
