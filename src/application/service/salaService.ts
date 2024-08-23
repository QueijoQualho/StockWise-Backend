import { Sala } from "@model/salaEntity";
import { Repository } from "typeorm";
import { SalaDTO, SalaUpdateDTO } from "@dto/index";
import { NotFoundError } from "@utils/errors";

export class SalaService {
  constructor(private readonly repository: Repository<Sala>) {}

  async findAll(): Promise<Sala[]> {
    return this.repository.find();
  }

  async findOne(localizacao: number): Promise<Sala | null> {
    return this.repository.findOneBy({ localizacao }) || null;
  }

  async create(salaDTO: SalaDTO): Promise<SalaDTO> {
    await this.repository.save(salaDTO);
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

    return {
      data: salas,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }
}
