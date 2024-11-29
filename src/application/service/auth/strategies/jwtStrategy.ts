import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import passport from 'passport';
import env from '@config/env';

export class JwtAuthStrategy {
  private readonly secretKey: string;

  constructor() {
    this.secretKey = env.jwt_secret;
    this.configureStrategy();
  }

  private configureStrategy() {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.secretKey,
    };

    passport.use(
      new JwtStrategy(options, async (payload, done) => {
        try {
          const user = {
            id: payload.id,
            username: payload.username,
            role: payload.role,
          };

          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
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
