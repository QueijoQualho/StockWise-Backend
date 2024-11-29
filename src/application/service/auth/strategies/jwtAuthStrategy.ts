import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import passport from 'passport';
import { UserRole } from '@model/enum/roles';

export class JwtAuthStrategy {
  private readonly secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey
  }

  configureStrategy() {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.secretKey,
    };

    passport.use(
      new JwtStrategy(options, async (payload: UserPayload, done) => {
        try {
          console.log("Payload recebido:", payload);
          if (!payload || !payload.id || !payload.role) {
            return done(null, false, { message: 'Invalid token payload' });
          }
          const user = {
            id: payload.id,
            name: payload.name,
            email: payload.email,
            role: payload.role,
          };
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      })
    );
  }

  initialize() {
    return passport.initialize();
  }

  authenticate() {
    return passport.authenticate('jwt', { session: false });
  }
}

export interface UserPayload {
  id: number,
  name: string,
  email: string,
  role: UserRole,
}
