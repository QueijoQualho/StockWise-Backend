import { Express, Router } from "express";
import itemRouter from "./itemRouter";
import salaRouter from "./salaRouter";
import seedRouter from "./seedRouter";

export default (app: Express): void => {
  const router = Router();
  itemRouter(router);
  salaRouter(router);
  seedRouter(router);
  app.use("/api", router);
};
