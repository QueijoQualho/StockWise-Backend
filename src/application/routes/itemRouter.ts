import upload from "@config/multer";
import { controllerFactory } from "@utils/factory/ControllerFactory";
import { validateUpdateItem } from "@validation/ItemValidation";
import { Request, Response, Router } from "express";

export default (router: Router): void => {
  const itemController = controllerFactory.createItemController();

  // router.get("/itens", (req: Request, res: Response) =>
  //   itemController.getItens(req, res),
  // );

  router.get("/itens", (req: Request, res: Response) =>
    itemController.getItemPaginated(req, res),
  );

  router.get("/itens/:id", (req: Request, res: Response) =>
    itemController.getItemByID(req, res),
  );

  // router.post(
  //   "/itens",
  //   upload.single("file"),
  //   validateCreateItem,
  //   (req: Request, res: Response) => itemController.createItem(req, res),
  // );

  router.patch(
    "/itens/:id",
    upload.single("file"),
    validateUpdateItem,
    (req: Request, res: Response) => itemController.updateItem(req, res),
  );

  router.delete("/itens/:id", (req: Request, res: Response) =>
    itemController.deleteItem(req, res),
  );
};
