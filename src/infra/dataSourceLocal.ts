import { DataSource, DataSourceOptions } from "typeorm";

const connectionOptions: DataSourceOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "root",
  password: "root",
  database: "tcc",
  synchronize: false,
  logging: true,
  entities: [__dirname + "/../domain/model/*.{js,ts}"],
  migrations: [__dirname + "/migrations/*.{js,ts}"],
};

export default new DataSource({
  ...connectionOptions,
});
