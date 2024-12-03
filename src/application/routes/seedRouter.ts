import upload from "@config/multer";
import { controllerFactory } from "@service/factories/ControllerFactory";
import { adminGuard } from "@service/middleware/roleGuard";
import { Router, Response, Request, NextFunction } from "express";

export default (router: Router): void => {
  const seedController = controllerFactory.createSeedController();

  router.use('/seed', adminGuard.checkRole())

  router.get("/seed", (req: Request, res: Response, next: NextFunction) =>
    seedController.seedSalas(req, res, next),
  );

  router.post(
    "/seed/createItens",
    upload.single("file"),
    (req: Request, res: Response, next: NextFunction) =>
      seedController.createItemsFromFile(req, res, next),
  );
};
