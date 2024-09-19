import env from "@config/env";
import { DataSource, DataSourceOptions } from "typeorm";

const connectionOptions: DataSourceOptions = {
  type: "postgres",
  url: env.typeorm.url,
  entities: [__dirname + "/../domain/model/*.{js,ts}"],
  migrations: [__dirname + "/migrations/*.{js,ts}"],
  synchronize: false,
  logging: false,
  ssl: true,
};

export default new DataSource({
  ...connectionOptions,
});
