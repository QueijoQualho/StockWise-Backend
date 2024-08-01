import 'reflect-metadata';
import logger from './application/config/logger';
import app from './application/config/app';
import env from './application/config/env';
import Database from './application/service/database';

async function startServer() {
  try {
    const database = Database.getInstance();
    await database.initialize();

    app.listen(env.port, () => {
      logger.info('Servidor na porta', env.port);
    });
  } catch (error) {
    logger.error('Falha ao abrir o servidor', error);
  }
}

startServer();
