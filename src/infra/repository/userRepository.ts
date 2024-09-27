import { User } from '@model/userEntity';
import { EntityManager, Repository } from 'typeorm';
import Database from '../singleton/database';

export type UserRepositoryType = Repository<User>;
const databaseInstance = Database.getInstance();

const userRepository: UserRepositoryType = databaseInstance
  .getDataSource()
  .getRepository(User)
  .extend({});

export function getSalaRepository(manager?: EntityManager): Repository<User> {
  if (manager) {
    return manager.withRepository(userRepository);
  }
  return userRepository;
}
