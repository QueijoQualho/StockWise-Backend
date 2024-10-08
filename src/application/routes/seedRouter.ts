import { controllerFactory } from "@utils/factory/ControllerFactory";
import { Router, Response, Request, NextFunction } from "express";

export default (router: Router): void => {
  const seedController = controllerFactory.createSeedController();

  router.get("/seed", (req: Request, res: Response, next: NextFunction) =>
    seedController.seedSalas(req, res, next),
  );
};
