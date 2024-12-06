import { LoginDTO } from "@dto/user/loginDTO";
import { SignupDTO } from "@dto/user/signupDTO";
import { UserResponseDTO } from "@dto/user/userResponseDTO";
import { User } from "@model/userEntity";
import { UserService } from "@service/userService";
import { BadRequestError } from "@utils/errors";
import * as bcrypt from "bcrypt";
import { JwtService } from "./jwtService";

export class AuthService {
  constructor(private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async signup(signupDTO: SignupDTO): Promise<UserResponseDTO> {
    const hashedPassword = await this.hashPassword(signupDTO.senha);
    const newUser = this.buildUserEntity(signupDTO, hashedPassword);

    const savedUser = await this.userService.createUser(newUser);

    return savedUser;
  }

  async login(loginDTO: LoginDTO): Promise<any> {
    const user = await this.validateUser(loginDTO.email, loginDTO.senha)

    if (!user) {
      throw new BadRequestError('Invalid email or password')
    }

    const payload = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.generateToken(payload);

    return {
      token,
      user: new UserResponseDTO(user)
    };
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userService.getUserbyEmail(email);

    const isPasswordValid = this.verifyPasswordOrFail(pass, user.senha)

    return isPasswordValid ? user : null
  }

  // ======================================
  // = HELPER METHODS =
  // ======================================

  private buildUserEntity(signupDTO: SignupDTO, hashedPassword: string): User {
    return Object.assign(new User(), signupDTO, { senha: hashedPassword });
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async verifyPasswordOrFail(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordValid = await bcrypt.compare(plainPassword, hashedPassword);
    if (!isPasswordValid) {
      throw new BadRequestError("Invalid credentials");
    }
  }
}
