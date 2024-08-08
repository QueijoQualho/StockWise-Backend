import { ItemController } from "@controller/itemController";
import { ItemService } from "@service/itemService";

export const ItemControllerFactory = () => {
  const itemService = new ItemService();
  return new ItemController(itemService);
};
