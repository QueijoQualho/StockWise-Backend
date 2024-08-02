import { Express, Router } from 'express';
import itemRouter from './itemRouter.js';

export default (app: Express): void => {
  const router = Router();
  itemRouter(router);
  app.use('/api', router);
};
