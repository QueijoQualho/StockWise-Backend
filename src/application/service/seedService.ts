import logger from "@config/logger";
import { Sala } from "@model/salaEntity";
import { ItemRepositoryType } from "@infra/repository/itemRepository";
import { SalaRepositoryType } from "@infra/repository/salaRepository";

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

    logger.info(`Sala ${savedSala.nome} criada com sucesso.`);

    return savedSala;
  }

  async addItemsToSala(data: any): Promise<{ salaNome: string; itemsAdded: number; message: string }> {
    const existingSala = await this.salaRepository.findOne({
      where: { localizacao: data.localizacao },
    });

    if (!existingSala) {
      logger.error(`Sala com localização ${data.localizacao} não encontrada.`);
      return { salaNome: data.localizacao, itemsAdded: 0, message: 'Sala não encontrada.' };
    }

    // Filtra e salva apenas os itens que não possuem externalId duplicado
    const items = await this.saveUniqueItems(data.items, existingSala);

    if (items.length > 0) {
      logger.info(`Itens adicionados à sala ${existingSala.nome} com sucesso.`);
      return { salaNome: existingSala.nome, itemsAdded: items.length, message: 'Itens adicionados com sucesso.' };
    } else {
      logger.info(`Nenhum item novo foi adicionado à sala ${existingSala.nome}.`);
      return { salaNome: existingSala.nome, itemsAdded: 0, message: 'Nenhum item novo para adicionar.' };
    }
  }


  // Métodos privados

  private async saveUniqueItems(itemDataList: any[], sala: Sala): Promise<any[]> {
    const uniqueItems = [];

    for (const itemData of itemDataList) {
      const existingItem = await this.itemRepository.findOne({
        where: { externalId: itemData.id },
      });

      if (!existingItem) {
        const newItem = this.createItem(itemData, sala);
        uniqueItems.push(await this.itemRepository.save(newItem));
      }
    }

    return uniqueItems;
  }

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
}
