import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { isPublicRoute } from "./isPublicRoute";
import { unauthorized } from "@utils/errors/httpErrors";
import { UnauthorizedError } from "@utils/errors";

export class JwtAuthGuard {
  canActivate() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (isPublicRoute(req)) {
        return next();
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      passport.authenticate("jwt", { session: false }, (err: any, user: Express.User, info: any) => {
        if (err) {
          return unauthorized(res, new UnauthorizedError("Erro interno"));
        }
        if (!user) {
          return unauthorized(res, new UnauthorizedError("invalid token"));
        }

        req.user = user;
        next();
      })(req, res, next);
    };
  }
}
