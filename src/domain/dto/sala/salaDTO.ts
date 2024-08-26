import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class SalaDTO {
  @IsInt()
  @IsNotEmpty()
  localizacao: number;

  @IsString()
  @IsNotEmpty()
  nome: string;
}
