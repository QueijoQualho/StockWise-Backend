import { ItemUpdateDTO } from "@dto/index";
import { Item } from "@model/itemEntity";
import { Sala } from "@model/salaEntity";
import { ItemRepositoryType } from "@infra/repository/itemRepository";
import { SalaRepositoryType } from "@infra/repository/salaRepository";
import { BadRequestError, NotFoundError } from "@utils/errors";
import { Pageable, PaginationParams } from "@utils/interfaces";
import { deleteFromAzure, uploadToAzure } from "./azureBlobService";

export class ItemService {
  constructor(
    private readonly repository: ItemRepositoryType,
    private readonly salaRepository: SalaRepositoryType,
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

  async update(
    id: number,
    updatedItemDTO: ItemUpdateDTO,
    file?: Express.Multer.File,
  ): Promise<void> {
    const item = await this.getItemOrThrow(id);

    if (file) {
      const newFileUrl = await this.uploadFile(file, item.url);
      item.url = newFileUrl;
    }

    if (updatedItemDTO.salaId && item.sala.id !== updatedItemDTO.salaId) {
      item.sala = await this.getSalaOrThrow(updatedItemDTO.salaId);
    }

    this.updateItemFields(item, updatedItemDTO);
    await this.repository.save(item);
  }

  async delete(id: number): Promise<void> {
    const item = await this.getItemOrThrow(id);
    await Promise.all([
      deleteFromAzure(item.url), // Deleta o arquivo do Azure
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

  private async uploadFile(
    file: Express.Multer.File,
    existingFileUrl?: string,
  ): Promise<string> {
    try {
      // Faz o upload do novo arquivo para o Azure
      const fileUrl = await uploadToAzure(file);

      // Se houver um arquivo existente, deleta ele
      if (existingFileUrl) {
        await deleteFromAzure(existingFileUrl);
      }

      return fileUrl;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error:any) {
      throw new BadRequestError("Error processing file upload");
    }
  }

  private async getSalaOrThrow(salaId: number): Promise<Sala> {
    const sala = await this.salaRepository.findOne({ where: { id: salaId } });
    if (!sala) throw new NotFoundError("Sala not found");
    return sala;
  }

  private updateItemFields(item: Item, updatedItemDTO: ItemUpdateDTO): void {
    Object.assign(item, updatedItemDTO);
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
