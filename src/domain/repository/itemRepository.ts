import { Item } from "@model/itemEntity";
import Database from "@service/database";
import { EntityManager, Repository } from "typeorm";

export type ItemRepositoryType = Repository<Item>;
const databaseInstance = Database.getInstance();

const UserRepository: ItemRepositoryType = databaseInstance
  .getDataSource()
  .getRepository(Item)
  .extend({});

export function getUserRepository(manager?: EntityManager): Repository<Item> {
  if (manager) {
    return manager.withRepository(UserRepository);
  }
  return UserRepository;
}
