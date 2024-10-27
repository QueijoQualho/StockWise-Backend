import { Relatorio } from "@model/relatorioEntity";
import { EntityManager, Repository } from "typeorm";
import Database from "../singleton/database";

export type RelatorioRepositoryType = Repository<Relatorio>;
const databaseInstance = Database.getInstance();

const RelatorioRepository: RelatorioRepositoryType = databaseInstance
  .getDataSource()
  .getRepository(Relatorio)
  .extend({});

export function getRelatorioRepository(
  manager?: EntityManager,
): Repository<Relatorio> {
  if (manager) {
    return manager.withRepository(RelatorioRepository);
  }
  return RelatorioRepository;
}
