import { UserRole } from "@model/enum/roles";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from "class-validator";

export class SignupDTO {
  @IsNotEmpty({ message: "O nome é obrigatório" })
  nome: string;

  @IsEmail({}, { message: "O e-mail deve ser válido" })
  email: string;

  @IsNotEmpty({ message: "A senha é obrigatória" })
  @MinLength(6, { message: "A senha deve ter pelo menos 6 caracteres" })
  senha: string;

  @IsOptional()
  @IsEnum(UserRole, { message: "O papel do usuário deve ser um valor válido" })
  role?: UserRole;
}
