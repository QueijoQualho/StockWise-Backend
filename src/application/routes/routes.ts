import { Express, Router } from "express";
import itemRouter from "./itemRouter";
import salaRouter from "./salaRouter";
import seedRouter from "./seedRouter";
import authRouter from "./authRouter";
import userRouter from "./userRouter";

export default (app: Express): void => {
  const router = Router();
  itemRouter(router);
  salaRouter(router);
  seedRouter(router);
  authRouter(router);
  userRouter(router);
  app.use("/api", router);
};
