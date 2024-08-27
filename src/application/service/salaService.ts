import { Sala } from "@model/salaEntity";
import { SalaDTO, SalaUpdateDTO } from "@dto/index";
import { NotFoundError } from "@utils/errors";
import { ItemRepositoryType } from "@repository/itemRepository";
import { SalaRepositoryType } from "@repository/salaRepository";

export class SalaService {
  constructor(
    private readonly repository: SalaRepositoryType,
    private readonly itemRespository: ItemRepositoryType
  ) { }

  async findAll(): Promise<Sala[]> {
    return this.repository.find();
  }

  async findOne(localizacao: number): Promise<Sala | null> {
    return this.repository.findOneBy({ localizacao }) || null;
  }

  async create(salaDTO: SalaDTO): Promise<SalaDTO> {
    const sala = new Sala();

    Object.assign(sala, salaDTO);

    await this.repository.save(sala);
    return salaDTO;
  }

  async update(id: number, updatedSalaDTO: SalaUpdateDTO): Promise<void> {
    const sala = await this.findOne(id);
    if (!sala) throw new NotFoundError("Sala not found");

    await this.repository.update(id, updatedSalaDTO);
  }

  async delete(id: number): Promise<void> {
    const sala = await this.findOne(id);
    if (!sala) throw new NotFoundError("Sala not found");

    await this.repository.delete(id);
  }

  async getPaginatedSalas(page: number, limit: number) {
    const [salas, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    if (!salas) {
      throw new NotFoundError("No items found");
    }

    return {
      data: salas,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async saveSala(data: any): Promise<Sala> {
    const newSala = this.repository.create({
      localizacao: data.localizacao,
      quantidadeDeItens: data['quantidade de itens'],
      nome: data.Sala,
      items: data.items.map(async (itemData: any) => {

        const item = this.itemRespository.create({
          externalId: itemData.id,
          nome: itemData.denominacao,
          dataDeIncorporacao: itemData.dataDeIncorporacao as Date,
        });
        return await this.itemRespository.save(item);
      })
    });

    return await this.repository.save(newSala);
  }
}
