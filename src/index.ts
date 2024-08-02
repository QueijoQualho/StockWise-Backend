import 'reflect-metadata';
import 'module-alias/register'; // Certifique-se de que isto é importado antes de outras importações

import app from '@config/app'; // Note que você não precisa usar a extensão .js
import env from '@config/env';
import logger from '@config/logger';
import Database from '@service/database';

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
