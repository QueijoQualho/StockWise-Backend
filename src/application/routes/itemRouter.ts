import { ItemControllerFactory } from "@utils/factory/ItemControllerFactory";
import { Router } from "express";

export default (router: Router): void => {
  const itemController = ItemControllerFactory();

  router.get("/items", (req, res) => itemController.getItem(req, res));
  router.get("/items/:id", (req, res) => itemController.getItemByID(req, res));
  router.post("/items", (req, res) => itemController.createItem(req, res));
  router.patch("/items/:id", (req, res) => itemController.updateItem(req, res));
  router.delete("/items/:id", (req, res) =>
    itemController.deleteItem(req, res),
  );
};
