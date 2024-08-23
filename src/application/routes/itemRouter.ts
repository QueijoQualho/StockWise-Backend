import upload from "@config/multer";
import { ItemControllerFactory } from "@utils/factory/ItemControllerFactory";
import {
  validateCreateItem,
  validateUpdateItem,
} from "@validation/ItemValidation";
import { Router, Request, Response } from "express";

export default (router: Router): void => {
  const itemController = ItemControllerFactory();

  router.get("/items", (req: Request, res: Response) => itemController.getItem(req, res));
  router.get("/items/:id", (req: Request, res: Response) => itemController.getItemByID(req, res));
  router.post(
    "/items",
    upload.single("file"),
    validateCreateItem,
    (req: Request, res: Response) => itemController.createItem(req, res),
  );

  router.patch(
    "/items/:id",
    upload.single("file"),
    validateUpdateItem,
    (req: Request, res: Response) => itemController.updateItem(req, res),
  );

  router.delete("/items/:id", (req: Request, res: Response) => itemController.deleteItem(req, res));
};
