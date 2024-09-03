import logger from "@config/logger";
import { Sala } from "@model/salaEntity";
import { ItemRepositoryType } from "@repository/itemRepository";
import { SalaRepositoryType } from "@repository/salaRepository";

export class SeedService {
  constructor(
    private readonly itemRepository: ItemRepositoryType,
    private readonly salaRepository: SalaRepositoryType,
  ) { }

  async saveSala(data: any): Promise<Sala> {
    const newSala = this.createSala(data);
    const savedSala = await this.salaRepository.save(newSala);

    const items = await this.saveItems(data.items, savedSala);

    savedSala.itens = items;

    this.logSalaCreation(savedSala);

    return savedSala;
  }

  // Métodos privados

  private createSala(data: any): Sala {
    return this.salaRepository.create({
      localizacao: data.localizacao,
      quantidadeDeItens: data["quantidade de itens"],
      nome: data.Sala,
    });
  }

  private async saveItems(itemDataList: any[], sala: Sala): Promise<any[]> {
    return Promise.all(
      itemDataList.map(async (itemData) => {
        const item = this.createItem(itemData, sala);
        return await this.itemRepository.save(item);
      }),
    );
  }

  private createItem(itemData: any, sala: Sala): any {
    return this.itemRepository.create({
      externalId: itemData.id,
      nome: itemData.denominacao,
      dataDeIncorporacao: itemData.dataDeIncorporacao as Date,
      sala: sala,
    });
  }

  private logSalaCreation(sala: Sala): void {
    logger.info(`Sala ${sala.nome} criada com sucesso.`);
  }
}
