import upload from "@config/multer";
import { salaControllerFactory } from "@utils/factory/SalaControllerFactory";
import { validateUpdateItem } from "@validation/ItemValidation";
import { validateCreateSala } from "@validation/salaValidation";
import { Router, Request, Response } from "express";

export default (router: Router): void => {
  const salaController = salaControllerFactory()

  router.get("/salas", (req: Request, res: Response) => salaController.getSala(req, res));
  router.get("/salas/:id", (req: Request, res: Response) => salaController.getSalaByID(req, res));

  router.post(
    "/salas",
    upload.single("file"),
    validateCreateSala,
    (req: Request, res: Response) => salaController.createSala(req, res),
  );

  router.patch(
    "/salas/:id",
    upload.single("file"),
    validateUpdateItem,
    (req: Request, res: Response) => salaController.updateSala(req, res),
  );

  router.delete("/salas/:id", (req: Request, res: Response) => salaController.deleteSala(req, res));
}
