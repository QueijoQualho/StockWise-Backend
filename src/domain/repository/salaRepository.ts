import { Sala } from "@model/salaEntity";
import { EntityManager, Repository } from "typeorm";
import Database from "../singleton/database";

export type SalaRepositoryType = Repository<Sala>;
const databaseInstance = Database.getInstance();

const SalaRepository: SalaRepositoryType = databaseInstance
  .getDataSource()
  .getRepository(Sala)
  .extend({});

export function getSalaRepository(manager?: EntityManager): Repository<Sala> {
  if (manager) {
    return manager.withRepository(SalaRepository);
  }
  return SalaRepository;
}
