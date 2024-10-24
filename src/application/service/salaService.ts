import { SalaDTO } from "@dto/index";
import { SalaRepositoryType } from "@infra/repository/salaRepository";
import { Item } from "@model/itemEntity";
import { Sala } from "@model/salaEntity";
import { NotFoundError } from "@utils/errors";
import { Pageable, PaginationParams } from "@utils/interfaces";
import { UploadService } from "./uploadService";
import { RelatorioRepositoryType } from "@infra/repository/relatorioRepository";

export class SalaService {

  constructor(
    private readonly salaRepository: SalaRepositoryType,
    private readonly relatorioRepository: RelatorioRepositoryType,
    private readonly uploadService: UploadService
  ) { }

  async findAll(): Promise<Sala[]> {
    return this.salaRepository.find();
  }

  async findOne(localizacao: number): Promise<Sala | null> {
    return this.salaRepository.findOneBy({ localizacao }) || null;
  }

  // async update(id: number, updatedSalaDTO: SalaUpdateDTO): Promise<void> {
  //   const sala = await this.getSalaOrThrow(id);
  //   const updatedSala = this.mapDTOToEntity(sala, updatedSalaDTO);
  //   await this.salaRepository.update(id, updatedSala);
  // }

  async delete(id: number): Promise<void> {
    const sala = await this.getSalaOrThrow(id);
    await this.salaRepository.delete(sala.id);
  }

  async getPaginatedSalas(
    pagination: PaginationParams,
  ): Promise<Pageable<Sala>> {
    const { page, limit } = pagination;
    const [salas, total] = await this.salaRepository.findAndCount({
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

  async uploadPDF(localizacao: number, file: Express.Multer.File) {
    const sala = await this.getSalaOrThrow(localizacao);
    const pdfUrl = await this.uploadService.uploadPdf(file);

    const pdf = await this.relatorioRepository.save({
      nome: file.originalname,
      url: pdfUrl,
      sala: sala
    });

    return pdf;
  }

  async getRelatoriosSala(
    localizacao: number,
  ) {
    const sala = await this.salaRepository.findOne({
      where: { localizacao: localizacao },
      relations: ['relatorios'],
      order: {
        id: 'ASC',
      }
    });

    if (!sala) throw new NotFoundError("Sala not found");

    return sala.relatorios
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
    const sala = await this.salaRepository.findOne({
      where: { localizacao },
      relations: ["itens"],
      order: {
        id: 'ASC',
      }
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
