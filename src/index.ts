/* eslint-disable @typescript-eslint/no-require-imports */
import "reflect-metadata";

if (process.env.NODE_ENV === "production") {
  require("module-alias/register");
} else {
  require("tsconfig-paths/register");
}

import app from "@config/app";
import env from "@config/env";
import logger from "@config/logger";
import Database from "./domain/singleton/database";

async function startServer() {
  try {
    const database = Database.getInstance();
    await database.initialize();
    logger.info("Conexão com o banco de dados estabelecida.");

    app.listen(env.port, () => {
      logger.info("Servidor na porta", env.port);
    });
  } catch (error) {
    logger.error("Falha ao abrir o servidor", error);
  }
}

startServer();
