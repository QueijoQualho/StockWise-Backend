import upload from "@config/multer";
import { controllerFactory } from "@service/factories/ControllerFactory";
import { validateUpdateItem } from "@utils/validation/ItemValidation";
import { NextFunction, Request, Response, Router } from "express";

export default (router: Router): void => {
  const itemController = controllerFactory.createItemController();

  router.get("/itens", (req: Request, res: Response, next: NextFunction) =>
    itemController.getItemPaginated(req, res, next),
  );

  router.get("/itens/:id", (req: Request, res: Response, next: NextFunction) =>
    itemController.getItemByID(req, res, next),
  );

  router.patch(
    "/itens/:id",
    upload.single("file"),
    validateUpdateItem,
    (req: Request, res: Response, next: NextFunction) =>
      itemController.updateItem(req, res, next),
  );

  router.delete(
    "/itens/:id",
    (req: Request, res: Response, next: NextFunction) =>
      itemController.deleteItem(req, res, next),
  );
};
