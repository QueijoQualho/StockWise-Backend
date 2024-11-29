import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Request } from 'express';
import { AuthService } from '../authService';

export class UserLoginStrategy {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
    this.configureStrategy();
  }

  private configureStrategy() {
    passport.use(
      'user-login',
      new LocalStrategy(
        { usernameField: 'email', passReqToCallback: true },
        async (req: Request, email: string, password: string, done: any) => {
          try {
            const user = await this.authService.validateUser(email, password);
            if (!user) {
              return done(null, false, { message: 'Invalid email or password' });
            }
            return done(null, user);
          } catch (error) {
            return done(error, false);
          }
        }
      )
    );
  }

  initialize() {
    return passport.initialize();
  }

  authenticate() {
    return passport.authenticate('user-login', { session: false });
  }
}
