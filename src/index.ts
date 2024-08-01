import app from "./config/app.js";
import env from "./config/env.js";
import logger from "./config/logger.js";

async function startServer() {
  try {
    app.listen(env.port, () => {
      logger.info('Servidor na porta: ', env.port);
    });
  } catch (err) {
    logger.error('Falha ao abrir o servidor: ', err);
  }
}

startServer()
