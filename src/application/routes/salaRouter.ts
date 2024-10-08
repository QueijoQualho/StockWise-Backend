import { controllerFactory } from "@utils/factory/ControllerFactory";
import { validateUpdateSala } from "@validation/salaValidation";
import { NextFunction, Request, Response, Router } from "express";

export default (router: Router): void => {
  const salaController = controllerFactory.createSalaController();

  router.get("/salas", (req: Request, res: Response, next: NextFunction) =>
    salaController.getSalas(req, res, next),
  );

  router.get("/salas/paged", (req: Request, res: Response,  next: NextFunction) =>
    salaController.getSalasPaginated(req, res, next),
  );

  router.get("/salas/:id", (req: Request, res: Response, next: NextFunction) =>
    salaController.getSalaByID(req, res, next),
  );

  router.get(
    "/salas/:id/itens",
    (req: Request, res: Response, next: NextFunction) =>
      salaController.getItensSala(req, res, next),
  );

  router.patch(
    "/salas/:id",
    validateUpdateSala,
    (req: Request, res: Response, next: NextFunction) =>
      salaController.updateSala(req, res, next),
  );

  router.delete(
    "/salas/:id",
    (req: Request, res: Response, next: NextFunction) =>
      salaController.deleteSala(req, res, next),
  );
};
