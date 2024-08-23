import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SalaUpdateDTO {

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nome?: string;
}
