export class ItemResponseDTO {
  constructor(
    readonly id: number,
    readonly nome: string,
    readonly dataDeIncorporacao: Date,
    readonly status: string,
    readonly url?: string,
    readonly sala?: SalaResponseDto
  ) {}
}

class SalaResponseDto {
  id: number;
  nome: string;
  localizacao: number;
}
