import { SalaDTO, SalaUpdateDTO } from "@dto/index";
import { Sala } from "@model/salaEntity";
import { SalaRepositoryType } from "@repository/salaRepository";
import { NotFoundError } from "@utils/errors";

export class SalaService {
  constructor(
    private readonly repository: SalaRepositoryType,
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

  async getPaginatedItensSala(localizacao: number, page: number, limit: number) {
    const sala = await this.repository.findOne({
      where: { localizacao },
      relations: ['itens'],
    });

    if (!sala) throw new NotFoundError("Sala not found");

    const itens = sala.itens;
    const totalItens = itens.length;

    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, totalItens);

    const itensPagina = itens.slice(startIndex, endIndex);

    return {
      data: itensPagina,
      totalItems: totalItens,
      totalPages: Math.ceil(totalItens / limit),
      currentPage: page,
    };
  }


}
