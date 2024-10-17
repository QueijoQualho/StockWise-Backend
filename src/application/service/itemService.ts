import { ItemUpdateDTO } from "@dto/index";
import { ItemRepositoryType } from "@infra/repository/itemRepository";
import { SalaRepositoryType } from "@infra/repository/salaRepository";
import { Item } from "@model/itemEntity";
import { Sala } from "@model/salaEntity";
import { NotFoundError } from "@utils/errors";
import { Pageable, PaginationParams } from "@utils/interfaces";
import { UploadService } from "./uploadService"; // Importe o UploadService

export class ItemService {
  constructor(
    private readonly repository: ItemRepositoryType,
    private readonly salaRepository: SalaRepositoryType,
    private readonly uploadService: UploadService // Adicione o UploadService como dependência
  ) {}

  async findAll(): Promise<Item[]> {
    return this.repository.find({
      order: {
        nome: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Item | null> {
    return this.repository.findOneBy({ externalId: id }) || null;
  }

  async update(id: number, updatedItemDTO: ItemUpdateDTO, file?: Express.Multer.File): Promise<void> {
    const item = await this.getItemOrThrow(id);

    if (updatedItemDTO.salaLocalizacao && item.sala.id !== updatedItemDTO.salaLocalizacao) {
      item.sala = await this.getSalaOrThrow(updatedItemDTO.salaLocalizacao);
    }

    if (file) {
      item.url = await this.uploadService.uploadFile(file, item.url);
    }

    Object.assign(item, updatedItemDTO);
    await this.repository.save(item);
  }

  async delete(id: number): Promise<void> {
    const item = await this.getItemOrThrow(id);
    await Promise.all([
      this.uploadService.deleteFile(item.url),
      this.repository.delete(id),
    ]);
  }

  async getPaginatedItems(
    pagination: PaginationParams,
  ): Promise<Pageable<Item>> {
    const { page, limit } = pagination;

    const [items, total] = await this.repository.findAndCount({
      skip: this.calculateOffset(page, limit),
      take: limit,
      order: {
        id: 'ASC',
      },
    });

    if (items.length === 0) throw new NotFoundError("No items found");

    return this.createPageable(items, total, page, limit);
  }

  // Métodos privados

  private async getItemOrThrow(id: number): Promise<Item> {
    const item = await this.findOne(id);
    if (!item) throw new NotFoundError("Item not found");
    return item;
  }

  private async getSalaOrThrow(salaLocalizacao: number): Promise<Sala> {
    const sala = await this.salaRepository.findOne({ where: { localizacao: salaLocalizacao } });
    if (!sala) throw new NotFoundError("Sala not found");
    return sala;
  }

  private calculateOffset(page: number, limit: number): number {
    return (page - 1) * limit;
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
