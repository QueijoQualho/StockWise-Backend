import { SalaDTO } from "@dto/index";
import { SalaRepositoryType } from "@infra/repository/salaRepository";
import { Item } from "@model/itemEntity";
import { Sala } from "@model/salaEntity";
import { NotFoundError } from "@utils/errors";
import { Pageable, PaginationParams } from "@utils/interfaces";
import { RelatorioRepositoryType } from "@infra/repository/relatorioRepository";
import { Relatorio } from "@model/relatorioEntity";
import { UploadService } from "@service/uploadService";
import {
  calculateOffset,
  createPageable,
  paginateArray,
} from "@utils/helpers/paginationUtil";

export class SalaService {
  constructor(
    private readonly salaRepository: SalaRepositoryType,
    private readonly relatorioRepository: RelatorioRepositoryType,
    private readonly uploadService: UploadService,
  ) { }

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
    itemName?: string
  ): Promise<Pageable<Item>> {
    const sala = await this.getSalaWithItemsOrThrow(localizacao);

    const filteredItems = itemName
    ? sala.itens.filter(item =>
        item.nome.toLowerCase().includes(itemName.toLowerCase())
      )
    : sala.itens;

    const paginatedItems = paginateArray(filteredItems, pagination);

    return createPageable(
      paginatedItems,
      filteredItems.length,
      pagination.page,
      pagination.limit,
    );
  }

  async uploadPDF(localizacao: number, file: Express.Multer.File) {
    const sala = await this.getSalaOrThrow(localizacao);
    const pdfUrl = await this.uploadService.uploadPdf(file);

    return this.relatorioRepository.save({
      nome: file.originalname,
      url: pdfUrl,
      sala: sala,
    });
  }

  async getRelatoriosSala(
    localizacao: number,
    pagination: PaginationParams,
    dataInicio?: Date,
    dataLimite?: Date
  ): Promise<Pageable<Relatorio>> {
    const sala = await this.getSalaWithRelatoriosOrThrow(localizacao);

    // Aplica o filtro usando a função auxiliar
    const relatorios = this.filterRelatoriosByDate(sala.relatorios, dataInicio, dataLimite);

    const paginatedReports = paginateArray(relatorios, pagination);

    return createPageable(
      paginatedReports,
      relatorios.length,
      pagination.page,
      pagination.limit,
    );
  }

  async getAllRelatoriosSala(
    pagination: PaginationParams,
    dataInicio?: Date,
    dataLimite?: Date
  ): Promise<Pageable<Relatorio>> {
    const salas = await this.salaRepository.find({
      relations: ["relatorios"],
    });

    let relatorios: Relatorio[] = salas.flatMap((sala) => sala.relatorios);

    relatorios = this.filterRelatoriosByDate(relatorios, dataInicio, dataLimite);

    const paginatedReports = paginateArray(relatorios, pagination);

    return createPageable(
      paginatedReports,
      relatorios.length,
      pagination.page,
      pagination.limit,
    );
  }

  // ======================================
  // = HELPER METHODS =
  // ======================================

  private mapDTOToEntity(sala: Sala, salaDTO: Partial<SalaDTO>): Sala {
    return Object.assign(sala, salaDTO);
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
      order: { id: "ASC" },
    });
    if (!sala) throw new NotFoundError("Sala not found");
    return sala;
  }

  private async getSalaWithRelatoriosOrThrow(
    localizacao: number,
  ): Promise<Sala> {
    const sala = await this.salaRepository.findOne({
      where: { localizacao: localizacao },
      relations: ["relatorios"],
      order: { id: "ASC" },
    });
    if (!sala) throw new NotFoundError("Sala not found");
    return sala;
  }

  private filterRelatoriosByDate(
    relatorios: Relatorio[],
    dataInicio?: Date,
    dataLimite?: Date
  ): Relatorio[] {
    return relatorios.filter((relatorio) => {
      const dataCriacao = new Date(relatorio.dataCriacao);
      dataCriacao.setUTCHours(0, 0, 0, 0);

      return (
        (!dataInicio || dataCriacao >= dataInicio) &&
        (!dataLimite || dataCriacao <= dataLimite)
      );
    });
  }
}
