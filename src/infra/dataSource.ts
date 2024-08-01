import { DataSource } from 'typeorm';
import env from '../application/config/env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.typeorm.host,
  port: env.typeorm.port,
  username: env.typeorm.username,
  password: env.typeorm.password,
  database: env.typeorm.database,
  synchronize: true,
  logging: false,
  entities: [__dirname + '../model/*.{js,ts}'],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
});
