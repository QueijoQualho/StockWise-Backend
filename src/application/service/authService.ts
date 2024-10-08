import { LoginDTO } from "@dto/user/loginDTO";
import { SignupDTO } from "@dto/user/signupDTO";
import { UserResponseDTO } from "@dto/user/userResponseDTO";
import { UserRepositoryType } from "@infra/repository/userRepository";
import { User } from "@model/userEntity";
import { BadRequestError } from "@utils/errors";
import * as bcrypt from "bcrypt";

export class AuthService {
  constructor(private readonly userRepository: UserRepositoryType) {}

  async signup(signupDTO: SignupDTO): Promise<UserResponseDTO> {
    const { email, senha } = signupDTO;

    const userExists = await this.userRepository.findOneBy({ email });
    if (userExists) {
      throw new BadRequestError("O e-mail já está em uso");
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser: User = Object.assign(new User(), signupDTO, {
      senha: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    const response = new UserResponseDTO(savedUser);

    return response;
  }

  async login(loginDTO: LoginDTO): Promise<UserResponseDTO> {
    const { email, senha } = loginDTO;

    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestError("Credenciais inválidas");
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      throw new BadRequestError("Credenciais inválidas");
    }

    const response = new UserResponseDTO(user);

    return response;
  }
}
