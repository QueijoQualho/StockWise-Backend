import { Express, Router } from "express";
import itemRouter from "./itemRouter";
import salaRouter from "./salaRouter";

export default (app: Express): void => {
  const router = Router();
  itemRouter(router);
  salaRouter(router)
  app.use("/api", router);
};
