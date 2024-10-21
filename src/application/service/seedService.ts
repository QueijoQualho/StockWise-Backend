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

  async addItemsToSala(data: any): Promise<Sala | null> {
    // Busca a sala existente pelo localizacao
    const existingSala = await this.salaRepository.findOne({
      where: { localizacao: data.localizacao },
    });
    if (!existingSala) {
      logger.error(`Sala com localização ${data.localizacao} não encontrada.`);
      return null;
    }

    // Filtra e salva apenas os itens que não possuem externalId duplicado
    const items = await this.saveUniqueItems(data.items, existingSala);

    if (items.length > 0) {
      existingSala.itens = [...existingSala.itens, ...items];
      logger.info(`Itens adicionados à sala ${existingSala.nome} com sucesso.`);
    } else {
      logger.info(`Nenhum item novo foi adicionado à sala ${existingSala.nome}.`);
    }

    return existingSala;
  }

  // Métodos privados

  private async saveUniqueItems(itemDataList: any[], sala: Sala): Promise<any[]> {
    return Promise.all(
      itemDataList
        .filter(async (itemData) => {
          const existingItem = await this.itemRepository.findOne({
            where: { externalId: itemData.id },
          });
          return !existingItem;
        })
        .map(async (itemData) => {
          const item = this.createItem(itemData, sala);
          return await this.itemRepository.save(item);
        }),
    );
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
