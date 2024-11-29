import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { isPublicRoute } from "./isPublicRoute";
import { unauthorized } from "@utils/errors/httpErrors";
import { UnauthorizedError } from "@utils/errors";

export class JwtAuthGuard {
  canActivate() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (isPublicRoute(req)) {
        return next(); // Libera rotas públicas
      }

      // Usa o Passport para autenticar com a JwtStrategy
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      passport.authenticate("jwt", { session: false }, (err: any, user: Express.User, info: any) => {
        if (err) {
          return unauthorized(res, new UnauthorizedError("Erro interno"));
        }
        if (!user) {
          return unauthorized(res, new UnauthorizedError("invalid token"));
        }

        // Adiciona o usuário à requisição
        req.user = user;

        // Passa para o próximo middleware
        next();
      })(req, res, next);
    };
  }
}
