import {
  IsString,
  IsOptional,
  IsInt,
  IsNotEmpty,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { IsDateFormat } from "../../decorator/isDateFormat";
import { Status } from "@model/itemEntity";

export class ItemDTO {
  @IsString({ message: "O nome deve ser uma string" })
  @IsNotEmpty({ message: "O nome não pode estar vazio" })
  nome: string;

  @IsDateFormat("DD-MM-YYYY", {
    message: "A dataDeIncorporacao deve estar no formato DD-MM-YYYY",
  })
  @IsNotEmpty({ message: "A dataDeIncorporacao não pode estar vazia" })
  dataDeIncorporacao: string;

  @IsEnum(Status, { message: "O status deve ser um dos valores permitidos" })
  @IsOptional()
  status?: Status;

  @IsOptional()
  @IsInt({ message: "O ID da sala deve ser um número inteiro" })
  @Type(() => Number)
  salaLocalizacao?: number;
}
