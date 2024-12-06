import { UserRole } from '@model/enum/roles';
import { UserPayload } from '@service/auth/strategies/jwtAuthStrategy';
import { ForbiddenError, UnauthorizedError } from '@utils/errors';
import { forbidden, unauthorized } from '@utils/errors/httpErrors';
import { Request, Response, NextFunction } from 'express';

class RoleGuard {
  private requiredRole: UserRole;

  constructor(requiredRole: UserRole) {
    this.requiredRole = requiredRole;
  }

  checkRole() {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = req.user as UserPayload;

      if (!user) {
        return unauthorized(res, new UnauthorizedError("User not authenticate"));
      }

      if (user.role !== this.requiredRole) {
        return forbidden(res, new ForbiddenError("Access denied"));
      }

      next();
    };
  }
}

export const adminGuard = new RoleGuard(UserRole.ADMIN)
export const userGuard = new RoleGuard(UserRole.USER)
