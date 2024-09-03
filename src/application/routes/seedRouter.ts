import { controllerFactory } from "@utils/factory/ControllerFactory";
import { Router, Response, Request } from "express";

export default (router: Router): void => {
  const seedController = controllerFactory.createSeedController();

  router.get("/seed", (req: Request, res: Response) =>
    seedController.seedSalas(req, res),
  );
};
