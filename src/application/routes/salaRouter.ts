import upload from "@config/multer";
import { controllerFactory } from "@utils/factory/ControllerFactory";
import { validateUpdateItem } from "@validation/ItemValidation";
import { Request, Response, Router } from "express";

export default (router: Router): void => {
  const salaController = controllerFactory.createSalaController();

  router.get("/salas", (req: Request, res: Response) =>
    salaController.getSala(req, res),
  );

  router.get("/salas/:id", (req: Request, res: Response) =>
    salaController.getSalaByID(req, res),
  );

  router.get("/salas/:id/itens", (req: Request, res: Response) =>
    salaController.getItensSala(req, res),
  );

  // router.post(
  //   "/salas",
  //   upload.single("file"),
  //   validateCreateSala,
  //   (req: Request, res: Response) => salaController.createSala(req, res),
  // );

  router.patch(
    "/salas/:id",
    upload.single("file"),
    validateUpdateItem,
    (req: Request, res: Response) => salaController.updateSala(req, res),
  );

  router.delete("/salas/:id", (req: Request, res: Response) =>
    salaController.deleteSala(req, res),
  );
};
