import { SalaRepositoryType } from "@infra/repository/salaRepository";
import { Item } from "@model/itemEntity";
import { Sala } from "@model/salaEntity";
import { BadRequestError, NotFoundError } from "@utils/errors";
import { itemFilters, Pageable, PaginationParams } from "@utils/interfaces";
import { RelatorioRepositoryType } from "@infra/repository/relatorioRepository";
import { Relatorio } from "@model/relatorioEntity";
import { UploadService } from "@service/uploadService";
import {
  calculateOffset,
  createPageable,
  paginateArray,
} from "@utils/helpers/paginationUtil";
import { Status } from "@model/enum/status";

export class SalaService {
  constructor(
    private readonly salaRepository: SalaRepositoryType,
    private readonly relatorioRepository: RelatorioRepositoryType,
    private readonly uploadService: UploadService,
  ) {}

  // ===========================
  // Public Methods
  // ===========================

  async findAll(): Promise<Sala[]> {
    return this.salaRepository.find();
  }

  async findOne(localizacao: number): Promise<Sala | null> {
    return this.salaRepository.findOneBy({ localizacao }) || null;
  }

  async delete(id: number): Promise<void> {
    const sala = await this.getSalaOrThrow(id);
    await this.salaRepository.delete(sala.id);
  }

  async getPaginatedSalas(
    pagination: PaginationParams,
  ): Promise<Pageable<Sala>> {
    const { page, limit } = pagination;

    const [salas, total] = await this.salaRepository.findAndCount({
      skip: calculateOffset(page, limit),
      take: limit,
    });

    return createPageable(salas, total, page, limit);
  }

  async getPaginatedItensSala(
    localizacao: number,
    pagination: PaginationParams,
    filters?: itemFilters,
  ): Promise<Pageable<Item>> {
    const sala = await this.getSalaOrThrow(localizacao);
    const items = await this.fetchFilteredItems(sala.localizacao, filters);
    const paginatedItems = paginateArray(items, pagination);

    return createPageable(paginatedItems, items.length, pagination.page, pagination.limit);
  }

  async uploadPDF(localizacao: number, file: Express.Multer.File): Promise<Relatorio> {
    const sala = await this.getSalaOrThrow(localizacao);
    const pdfUrl = await this.uploadService.uploadPdf(file);

    return this.relatorioRepository.save({
      nome: file.originalname,
      url: pdfUrl,
      sala,
    });
  }

  async getRelatoriosSala(
    localizacao: number,
    pagination: PaginationParams,
    dataInicio?: Date,
    dataLimite?: Date,
  ): Promise<Pageable<Relatorio>> {
    const sala = await this.getSalaWithRelatoriosOrThrow(localizacao);
    const filteredRelatorios = this.filterRelatoriosByDate(sala.relatorios, dataInicio, dataLimite);

    return this.paginateRelatorios(filteredRelatorios, pagination);
  }

  async getAllRelatoriosSala(
    pagination: PaginationParams,
    dataInicio?: Date,
    dataLimite?: Date,
  ): Promise<Pageable<Relatorio>> {
    const relatorios = await this.fetchAllRelatorios(dataInicio, dataLimite);
    return this.paginateRelatorios(relatorios, pagination);
  }

  // ===========================
  // Private Helper Methods
  // ===========================

  private async fetchFilteredItems(
    localizacao: number,
    filters?: itemFilters,
  ): Promise<Item[]> {
    const query = this.salaRepository
      .createQueryBuilder("sala")
      .leftJoinAndSelect("sala.itens", "item")
      .where("sala.localizacao = :localizacao", { localizacao });

    this.applyItemFilters(query, filters);

    const [salaWithItems] = await query.getManyAndCount();
    return salaWithItems?.[0]?.itens ?? [];
  }

  private applyItemFilters(query: any, filters?: itemFilters): void {
    if (filters?.search) {
      query.andWhere("LOWER(item.nome) LIKE LOWER(:search)", {
        search: `%${filters.search.toLowerCase()}%`,
      });
    }

    if (filters?.status) {
      const normalizedStatus = this.normalizeStatus(filters.status);
      query.andWhere("item.status = :status", { status: normalizedStatus });
    }
  }

  private normalizeStatus(status: string): Status {
    const statusMap: Record<string, Status> = {
      DISPONIVEL: Status.DISPONIVEL,
      BAIXA: Status.BAIXA,
      EM_MANUTENCAO: Status.EM_MANUTENCAO,
    };

    const normalizedStatus = statusMap[status.toUpperCase()];
    if (!normalizedStatus) {
      throw new BadRequestError(`Invalid status value: ${status}`);
    }

    return normalizedStatus;
  }

  private async fetchAllRelatorios(dataInicio?: Date, dataLimite?: Date): Promise<Relatorio[]> {
    const salas = await this.salaRepository.find({ relations: ["relatorios"] });
    const relatorios = salas.flatMap((sala) => sala.relatorios);

    return this.filterRelatoriosByDate(relatorios, dataInicio, dataLimite);
  }

  private paginateRelatorios(
    relatorios: Relatorio[],
    pagination: PaginationParams,
  ): Pageable<Relatorio> {
    const paginatedReports = paginateArray(relatorios, pagination);

    return createPageable(
      paginatedReports,
      relatorios.length,
      pagination.page,
      pagination.limit,
    );
  }

  private async getSalaOrThrow(localizacao: number): Promise<Sala> {
    const sala = await this.findOne(localizacao);
    if (!sala) {
      throw new NotFoundError("Sala not found");
    }
    return sala;
  }

  private async getSalaWithRelatoriosOrThrow(
    localizacao: number,
  ): Promise<Sala> {
    const sala = await this.salaRepository.findOne({
      where: { localizacao },
      relations: ["relatorios"],
    });
    if (!sala) {
      throw new NotFoundError("Sala not found");
    }
    return sala;
  }

  private filterRelatoriosByDate(
    relatorios: Relatorio[],
    dataInicio?: Date,
    dataLimite?: Date,
  ): Relatorio[] {
    return relatorios.filter((relatorio) => {
      const dataCriacao = new Date(relatorio.dataCriacao);
      return (
        (!dataInicio || dataCriacao >= dataInicio) &&
        (!dataLimite || dataCriacao <= dataLimite)
      );
    });
  }
}
