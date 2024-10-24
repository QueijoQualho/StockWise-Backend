import { LoginDTO } from "@dto/user/loginDTO";
import { SignupDTO } from "@dto/user/signupDTO";
import { UserResponseDTO } from "@dto/user/userResponseDTO";
import { UserRepositoryType } from "@infra/repository/userRepository";
import { User } from "@model/userEntity";
import { BadRequestError } from "@utils/errors";
import * as bcrypt from "bcrypt";

export class AuthService {
  constructor(private readonly userRepository: UserRepositoryType) { }

  async signup(signupDTO: SignupDTO): Promise<UserResponseDTO> {
    await this.ensureEmailIsUnique(signupDTO.email);
    const hashedPassword = await this.hashPassword(signupDTO.senha);

    const newUser = this.buildUserEntity(signupDTO, hashedPassword);
    const savedUser = await this.userRepository.save(newUser);

    return new UserResponseDTO(savedUser);
  }

  async login(loginDTO: LoginDTO): Promise<UserResponseDTO> {
    const user = await this.findUserByEmailOrFail(loginDTO.email);
    await this.verifyPasswordOrFail(loginDTO.senha, user.senha);

    return new UserResponseDTO(user);
  }

  // ======================================
  // = HELPER METHODS =
  // ======================================

  private async ensureEmailIsUnique(email: string): Promise<void> {
    const userExists = await this.userRepository.findOneBy({ email });
    if (userExists) {
      throw new BadRequestError("The email is already in use");
    }
  }

  private buildUserEntity(signupDTO: SignupDTO, hashedPassword: string): User {
    return Object.assign(new User(), signupDTO, { senha: hashedPassword });
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10); //TODO colocar salt decente depois
  }

  private async findUserByEmailOrFail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestError("Invalid credentials");
    }
    return user;
  }

  private async verifyPasswordOrFail(
    plainPassword: string,
    hashedPassword: string
  ): Promise<void> {
    const isPasswordValid = await bcrypt.compare(plainPassword, hashedPassword);
    if (!isPasswordValid) {
      throw new BadRequestError("Invalid credentials");
    }
  }
}
