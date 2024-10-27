import { ItemUpdateDTO } from "@dto/index";
import { ItemRepositoryType } from "@infra/repository/itemRepository";
import { SalaRepositoryType } from "@infra/repository/salaRepository";
import { Item } from "@model/itemEntity";
import { Sala } from "@model/salaEntity";
import { NotFoundError } from "@utils/errors";
import { Pageable, PaginationParams } from "@utils/interfaces";
import { UploadService } from "./uploadService";
import { calculateOffset, createPageable } from "@utils/helpers/paginationUtil";

export class ItemService {
  constructor(
    private readonly repository: ItemRepositoryType,
    private readonly salaRepository: SalaRepositoryType,
    private readonly uploadService: UploadService,
  ) {}

  async findAll(): Promise<Item[]> {
    return this.repository.find({
      order: { nome: "ASC" },
    });
  }

  async findOne(id: number): Promise<Item | null> {
    return this.repository.findOneBy({ externalId: id }) || null;
  }

  async update(id: number, updatedItemDTO: ItemUpdateDTO): Promise<void> {
    const item = await this.getItemOrThrow(id);

    if (updatedItemDTO.salaLocalizacao) {
      item.sala = await this.updateItemSala(
        item,
        updatedItemDTO.salaLocalizacao,
      );
    }

    Object.assign(item, updatedItemDTO);
    await this.repository.save(item);
  }

  async delete(id: number): Promise<void> {
    const item = await this.getItemOrThrow(id);
    await this.deleteItemAndFile(item);
  }

  async getPaginatedItems(
    pagination: PaginationParams,
  ): Promise<Pageable<Item>> {
    const [items, total] = await this.fetchPaginatedItems(pagination);

    if (items.length === 0) throw new NotFoundError("No items found");

    return createPageable(items, total, pagination.page, pagination.limit);
  }

  async uploadImage(itemId: number, file: Express.Multer.File): Promise<void> {
    const item = await this.getItemOrThrow(itemId);
    item.url = await this.uploadService.uploadFile(file, item.url);
    await this.repository.save(item);
  }

  // ======================================
  // = HELPER METHODS =
  // ======================================

  private async getItemOrThrow(id: number): Promise<Item> {
    const item = await this.findOne(id);
    if (!item) throw new NotFoundError("Item not found");
    return item;
  }

  private async getSalaOrThrow(salaLocalizacao: number): Promise<Sala> {
    const sala = await this.salaRepository.findOne({
      where: { localizacao: salaLocalizacao },
    });
    if (!sala) throw new NotFoundError("Sala not found");
    return sala;
  }

  private async updateItemSala(
    item: Item,
    salaLocalizacao: number,
  ): Promise<Sala> {
    if (item.sala.id !== salaLocalizacao) {
      return this.getSalaOrThrow(salaLocalizacao);
    }
    return item.sala;
  }

  private async deleteItemAndFile(item: Item): Promise<void> {
    await Promise.all([
      this.uploadService.deleteFile(item.url),
      this.repository.delete(item.externalId),
    ]);
  }

  private async fetchPaginatedItems(
    pagination: PaginationParams,
  ): Promise<[Item[], number]> {
    const { page, limit } = pagination;
    return this.repository.findAndCount({
      skip: calculateOffset(page, limit),
      take: limit,
      order: { id: "ASC" },
    });
  }
}
