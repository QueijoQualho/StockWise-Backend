import { IsNotEmpty, IsString, IsArray, ValidateNested, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { ItemDTO } from "@dto/item/ItemDTO";

export class SalaUpdateDTO {

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nome?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDTO)
  items?: ItemDTO[];
}
