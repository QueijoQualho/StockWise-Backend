// src/dto/item.dto.ts
import { IsString, IsOptional, IsInt, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";
import { IsDateFormat } from "../decorator/isDateFormat";

export class ItemDTO {
  @IsString({ message: "O nome deve ser uma string" })
  @IsNotEmpty({ message: "O nome não pode esta vazio" })
  nome: string;

  @IsDateFormat("DD-MM-YYYY")
  @IsNotEmpty({ message: "O dataDeIncorporacao não pode esta vazio" })
  dataDeIncorporacao: string;

  @IsOptional()
  @IsInt({ message: "O ID da sala deve ser um número inteiro." })
  @Type(() => Number)
  salaId?: number;
}
