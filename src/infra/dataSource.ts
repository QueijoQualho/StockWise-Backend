import DataSourceProd from "./dataSourceProd";
import DataSourceLocal from "./dataSourceLocal";

const AppDataSource =
  process.env.NODE_ENV === "production" ? DataSourceProd : DataSourceLocal;

export default AppDataSource;
