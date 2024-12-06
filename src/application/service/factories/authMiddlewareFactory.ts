import env from "@config/env";
import { JwtService } from "@service/auth/jwtService";
import { JwtAuthStrategy } from "@service/auth/strategies/jwtAuthStrategy";
import { JwtAuthGuard } from "@service/middleware/jwtAuthGuard";

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
}

export const authMiddlewareFactory = new AuthMiddlewareFactory()
