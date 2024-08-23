import { Sala } from "@model/salaEntity";
import Database from "src/domain/singleton/database";
import { EntityManager, Repository } from "typeorm";

export type SalaRepositoryType = Repository<Sala>;
const databaseInstance = Database.getInstance();

const SalaRepository: SalaRepositoryType = databaseInstance
  .getDataSource()
  .getRepository(Sala)
  .extend({});

export function getItemRepository(manager?: EntityManager): Repository<Sala> {
  if (manager) {
    return manager.withRepository(SalaRepository);
  }
  return SalaRepository;
}
