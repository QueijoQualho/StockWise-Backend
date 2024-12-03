import { IsString, IsOptional, IsInt, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { Status } from "@model/enum/status";

export class ItemUpdateDTO {
  @IsOptional()
  @IsString({ message: "O nome deve ser uma string" })
  nome?: string;

  @IsOptional()
  dataDeIncorporacao?: Date;

  @IsOptional()
  @IsEnum(Status, { message: "O status deve ser um dos valores permitidos" })
  status?: Status;

  @IsOptional()
  @IsInt({ message: "O ID da sala deve ser um número inteiro" })
  @Type(() => Number)
  salaLocalizacao?: number;
}
