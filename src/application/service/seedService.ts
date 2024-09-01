import logger from '@config/logger';
import { Sala } from '@model/salaEntity';
import { ItemRepositoryType } from '@repository/itemRepository';
import { SalaRepositoryType } from '@repository/salaRepository';

export class SeedService {
  constructor(
    private readonly itemRespository: ItemRepositoryType,
    private readonly salaRepository: SalaRepositoryType,
  ) { }

  async saveSala(data: any): Promise<Sala> {
    const newSala = this.salaRepository.create({
      localizacao: data.localizacao,
      quantidadeDeItens: data['quantidade de itens'],
      nome: data.Sala,
    });

    const savedSala = await this.salaRepository.save(newSala);

    const items = await Promise.all(
      data.items.map(async (itemData: any) => {
        const item = this.itemRespository.create({
          externalId: itemData.id,
          nome: itemData.denominacao,
          dataDeIncorporacao: itemData.dataDeIncorporacao as Date,
          sala: savedSala,
        });
        return await this.itemRespository.save(item);
      })
    );

    savedSala.itens = items;

    logger.info(`Sala ${savedSala.nome} criada com sucesso.`);

    return savedSala;
  }
}
