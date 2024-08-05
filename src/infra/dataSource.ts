import env from '@config/env';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.typeorm.host,
  port: env.typeorm.port,
  username: env.typeorm.username,
  password: env.typeorm.password,
  database: env.typeorm.database,
  entities: [__dirname + '/../domain/model/*.{js,ts}'],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
});
