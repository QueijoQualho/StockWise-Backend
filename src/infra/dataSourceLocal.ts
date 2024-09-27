import env from "@config/env";
import { DataSource, DataSourceOptions } from "typeorm";

const connectionOptions: DataSourceOptions = {
  type: "postgres",
  host: env.typeorm.host,
  port: env.typeorm.port || 5432,
  username: env.typeorm.username,
  password: env.typeorm.password,
  database: env.typeorm.database,
  entities: [__dirname + "/../domain/model/*.{js,ts}"],
  migrations: [__dirname + "/db/migrations/*.{js,ts}"],
  synchronize: true,
  logging: false,
};

export default new DataSource({
  ...connectionOptions,
});
