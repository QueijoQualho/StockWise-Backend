import { IsString, IsOptional, IsInt, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { IsDateFormat } from "../../decorator/isDateFormat";
import { Status } from "@model/itemEntity";

export class ItemUpdateDTO {
  @IsOptional()
  @IsString({ message: "O nome deve ser uma string" })
  nome?: string;

  @IsOptional()
  @IsDateFormat("DD-MM-YYYY", {
    message: "A dataDeIncorporacao deve estar no formato DD-MM-YYYY",
  })
  dataDeIncorporacao?: Date;

  @IsOptional()
  @IsEnum(Status, { message: "O status deve ser um dos valores permitidos" })
  status?: Status;

  @IsOptional()
  @IsInt({ message: "O ID da sala deve ser um número inteiro" })
  @Type(() => Number)
  salaLocalizacao?: number;
}
