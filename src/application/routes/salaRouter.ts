import upload from "@config/multer";
import { controllerFactory } from "@service/factories/ControllerFactory";
import { adminGuard } from "@service/middleware/roleGuard";
import { NextFunction, Request, Response, Router } from "express";

export default (router: Router): void => {
  const salaController = controllerFactory.createSalaController();

  router.get("/salas", (req: Request, res: Response, next: NextFunction) =>
    salaController.getSalas(req, res, next),
  );

  router.get(
    "/salas/paged",
    (req: Request, res: Response, next: NextFunction) =>
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

  router.delete(
    "/salas/:id",
    adminGuard.checkRole(),
    (req: Request, res: Response, next: NextFunction) =>
      salaController.deleteSala(req, res, next),
  );

  router.post(
    "/salas/:id/upload-pdf",
    upload.single("file"),
    (req: Request, res: Response, next: NextFunction) =>
      salaController.uploadPDF(req, res, next),
  );

  //RELATORIO
  router.get(
    "/salas/:id/relatorios",
    adminGuard.checkRole(),
    (req: Request, res: Response, next: NextFunction) =>
      salaController.getRelatoriosSala(req, res, next),
  );

  router.get(
    "/relatorios",
    adminGuard.checkRole(),
    (req: Request, res: Response, next: NextFunction) =>
      salaController.getAllRelatorios(req, res, next),
  );
};
