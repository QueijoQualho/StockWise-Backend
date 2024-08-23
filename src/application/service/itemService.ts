import { ItemDTO, ItemUpdateDTO } from "@dto/index";
import { Item } from "@model/itemEntity";
import { Repository } from "typeorm";
import { FileService } from "@service/fileService";
import { BadRequestError, NotFoundError } from "@utils/errors";
import { Sala } from "@model/salaEntity";

export class ItemService {
  constructor(
    private readonly repository: Repository<Item>,
    private readonly fileService: FileService,
    private readonly salaRepository: Repository<Sala>,
  ) { }

  async findAll(): Promise<Item[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<Item | null> {
    return this.repository.findOneBy({ id }) || null;
  }

  async create(
    itemDTO: ItemDTO,
    file: Express.Multer.File | undefined,
  ): Promise<ItemDTO> {
    const item = new Item();

    Object.assign(item, itemDTO);

    if (itemDTO.salaId) {
      const sala = await this.salaRepository.findOne({ where: { localizacao: itemDTO.salaId } });
      if (!sala) {
        throw new BadRequestError('Sala not found');
      }
      item.sala = sala;
    }

    const fileUrlOrError = await this.fileService.processFileHandling(file);
    if (fileUrlOrError instanceof BadRequestError) throw fileUrlOrError;

    item.url = fileUrlOrError as string;

    await this.repository.save(item);
    return itemDTO;
  }

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

    const fileUrlOrError = await this.fileService.processFileHandling(
      file,
      id,
      this,
    );
    if (fileUrlOrError instanceof BadRequestError) throw fileUrlOrError;

    item.url = fileUrlOrError as string;
    await this.repository.update(id, updatedItemDTO);
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
    })

    console.log("sada");

    if(items.length == 0){
      throw new NotFoundError("")
    }

    return {
      data: items,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    }
  }
}
