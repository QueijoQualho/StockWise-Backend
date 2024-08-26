import "reflect-metadata";
import "tsconfig-paths/register";

import app from "@config/app";
import env from "@config/env";
import logger from "@config/logger";
import Database from "src/domain/singleton/database";

async function startServer() {
  try {
    const database = Database.getInstance();
    await database.initialize();

    app.listen(env.port, () => {
      logger.info("Servidor na porta", env.port);
    });
  } catch (error) {
    logger.error("Falha ao abrir o servidor", error);
  }
}

startServer();
