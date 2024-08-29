import { ItemUpdateDTO } from '@dto/index';
import { Item } from '@model/itemEntity';
import { ItemRepositoryType } from '@repository/itemRepository';
import { SalaRepositoryType } from '@repository/salaRepository';
import { FileService } from '@service/fileService';
import { BadRequestError, NotFoundError } from '@utils/errors';

export class ItemService {
  constructor(
    private readonly repository: ItemRepositoryType,
    private readonly fileService: FileService,
    private readonly salaRepository: SalaRepositoryType,
  ) { }

  async findAll(): Promise<Item[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<Item | null> {
    return this.repository.findOneBy({ id }) || null;
  }

  // async create(
  //   itemDTO: ItemDTO,
  //   file: Express.Multer.File | undefined,
  // ): Promise<ItemResponseDTO> {
  //   const item = new Item();

  //   Object.assign(item, itemDTO);

  //   let salaData;
  //   if (itemDTO.salaLocalizacao) {
  //     const sala = await this.salaRepository.findOne({
  //       where: { localizacao: itemDTO.salaLocalizacao as number },
  //     });
  //     if (!sala) {
  //       throw new BadRequestError("Sala not found");
  //     }
  //     item.sala = sala;
  //     salaData = {
  //       id: sala.id,
  //       nome: sala.nome,
  //       localizacao: sala.localizacao,
  //     }
  //   }

  //   const fileUrlOrError = await this.fileService.processFileHandling(file);
  //   if (fileUrlOrError instanceof BadRequestError) throw fileUrlOrError;

  //   item.url = fileUrlOrError as string;

  //   await this.repository.save(item);

  //   const responseData: ItemResponseDTO = {
  //     ...item,
  //     sala: salaData
  //   }

  //   return responseData;
  // }

  async update(
    id: number,
    updatedItemDTO: ItemUpdateDTO,
    file: Express.Multer.File | undefined,
  ): Promise<void> {
    const item = await this.findOne(id);
    if (!item) {
      if (file && file.path) await this.fileService.deleteFile(file.path);
      throw new NotFoundError("Item not found");
    }

    if (file) {
      const fileUrlOrError = await this.fileService.processFileHandling(file, id, this);
      if (fileUrlOrError instanceof BadRequestError) throw fileUrlOrError;

      if (fileUrlOrError !== item.url) {
        item.url = fileUrlOrError as string;
      }
    }

    if (updatedItemDTO.salaId && item.sala.id !== updatedItemDTO.salaId) {
      const newSala = await this.salaRepository.findOne({ where: { id: updatedItemDTO.salaId } });
      if (!newSala) throw new NotFoundError("Sala not found");

      item.sala = newSala;
    }

    this.checkForUpdates(item, updatedItemDTO);

    Object.assign(item, updatedItemDTO);
    await this.repository.save(item);

  }


  async delete(id: number): Promise<void> {
    const item = await this.findOne(id);
    if (!item) throw new NotFoundError("Item not found");

    await Promise.all([
      this.fileService.deleteFile(item.url),
      this.repository.delete(id),
    ]);
  }

  async getPaginatedItems(page: number, limit: number) {
    const [items, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    if (items.length == 0) {
      throw new NotFoundError("");
    }

    return {
      data: items,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  private checkForUpdates(item: Item, updatedItemDTO: ItemUpdateDTO): boolean {
    return (
      (updatedItemDTO.nome && item.nome !== updatedItemDTO.nome) ||
      (updatedItemDTO.dataDeIncorporacao && item.dataDeIncorporacao !== updatedItemDTO.dataDeIncorporacao) ||
      (updatedItemDTO.status && item.status !== updatedItemDTO.status)
    );
  }
}
