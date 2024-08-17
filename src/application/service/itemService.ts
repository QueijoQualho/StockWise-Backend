import { ItemDTO, ItemUpdateDTO } from "@dto/index";
import { Item } from "@model/itemEntity";
import { Repository } from "typeorm";
import { FileService } from "@service/fileService";
import { BadRequestError, NotFoundError } from "@utils/errors";

export class ItemService {
  constructor(
    private readonly repository: Repository<Item>,
    private readonly fileService: FileService,
  ) {}

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
    const fileUrlOrError = await this.fileService.processFileHandling(file);
    if (fileUrlOrError instanceof BadRequestError) throw fileUrlOrError;

    itemDTO.url = fileUrlOrError as string;
    await this.repository.save(itemDTO);
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

    updatedItemDTO.url = fileUrlOrError as string;
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
}
