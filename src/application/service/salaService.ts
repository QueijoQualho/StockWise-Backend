import { SalaDTO, SalaUpdateDTO } from "@dto/index";
import { Item } from "@model/itemEntity";
import { Sala } from "@model/salaEntity";
import { SalaRepositoryType } from "@infra/repository/salaRepository";
import { NotFoundError } from "@utils/errors";
import { Pageable, PaginationParams } from "@utils/interfaces";

export class SalaService {
  constructor(private readonly repository: SalaRepositoryType) {}

  async findAll(): Promise<Sala[]> {
    return this.repository.find();
  }

  async findOne(localizacao: number): Promise<Sala | null> {
    return this.repository.findOneBy({ localizacao }) || null;
  }

  async update(id: number, updatedSalaDTO: SalaUpdateDTO): Promise<void> {
    const sala = await this.getSalaOrThrow(id);
    const updatedSala = this.mapDTOToEntity(sala, updatedSalaDTO);
    await this.repository.update(id, updatedSala);
  }

  async delete(id: number): Promise<void> {
    const sala = await this.getSalaOrThrow(id);
    await this.repository.delete(sala.id);
  }

  async getPaginatedSalas(
    pagination: PaginationParams,
  ): Promise<Pageable<Sala>> {
    const { page, limit } = pagination;
    const [salas, total] = await this.repository.findAndCount({
      skip: this.calculateOffset(page, limit),
      take: limit,
    });

    return this.createPageable(salas, total, page, limit);
  }

  async getPaginatedItensSala(
    localizacao: number,
    pagination: PaginationParams,
  ): Promise<Pageable<Item>> {
    const sala = await this.getSalaWithItemsOrThrow(localizacao);
    const itensPagina = this.paginateArray(sala.itens, pagination);

    return this.createPageable(
      itensPagina,
      sala.itens.length,
      pagination.page,
      pagination.limit,
    );
  }

  // ======================================
  // = HELPER METHODS =
  // ======================================

  private mapDTOToEntity(sala: Sala, salaDTO: Partial<SalaDTO>): Sala {
    Object.assign(sala, salaDTO);
    return sala;
  }

  private async getSalaOrThrow(localizacao: number): Promise<Sala> {
    const sala = await this.findOne(localizacao);
    if (!sala) throw new NotFoundError("Sala not found");
    return sala;
  }

  private async getSalaWithItemsOrThrow(localizacao: number): Promise<Sala> {
    const sala = await this.repository.findOne({
      where: { localizacao },
      relations: ["itens"],
    });
    if (!sala) throw new NotFoundError("Sala not found");
    return sala;
  }

  private calculateOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  private paginateArray<T>(items: T[], pagination: PaginationParams): T[] {
    const { page, limit } = pagination;
    const startIndex = this.calculateOffset(page, limit);
    const endIndex = Math.min(startIndex + limit, items.length);
    return items.slice(startIndex, endIndex);
  }

  private createPageable<T>(
    data: T[],
    totalItems: number,
    currentPage: number,
    limit: number,
  ): Pageable<T> {
    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage,
    };
  }
}
