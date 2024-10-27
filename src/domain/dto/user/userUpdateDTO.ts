import { UserRole } from "@model/enum/roles";
import { IsEmail, IsEnum, IsOptional } from "class-validator";

export class UserUpdateDTO {
  @IsOptional()
  nome?: string;

  @IsEmail({}, { message: "O e-mail deve ser válido" })
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: "O papel do usuário deve ser um valor válido" })
  role?: UserRole;
}
