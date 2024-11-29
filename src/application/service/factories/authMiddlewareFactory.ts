import env from "@config/env";
import { JwtService } from "@service/auth/jwtService";
import { JwtAuthStrategy } from "@service/auth/strategies/jwtAuthStrategy";
import { UserLoginStrategy } from "@service/auth/strategies/localStrategy";
import { JwtAuthGuard } from "@service/middleware/jwtAuthGuard";
import { serviceFactory } from "./serviceFactory";
import { RoleGuard } from "@service/middleware/roleGuard";
import { UserRole } from "@model/enum/roles";

class AuthMiddlewareFactory {

  private readonly jwtSecret: string
  private readonly jwtService: JwtService

  constructor() {
    this.jwtSecret = env.jwt_secret
    this.jwtService = new JwtService(this.jwtSecret)
  }

  createJwtGuard(): JwtAuthGuard{
    return new JwtAuthGuard()
  }

  createJwtStrategy(): JwtAuthStrategy{
    return new JwtAuthStrategy(this.jwtSecret)
  }

  createLocalStrategy(): UserLoginStrategy{
    return new UserLoginStrategy(serviceFactory.getAuthService())
  }

  createUserGuard(): RoleGuard{
    return new RoleGuard(UserRole.USER)
  }

  createAdminGuard(): RoleGuard{
    return new RoleGuard(UserRole.ADMIN)
  }
}

export const authMiddlewareFactory = new AuthMiddlewareFactory()
