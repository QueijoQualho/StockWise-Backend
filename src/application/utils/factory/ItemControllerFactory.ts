import { ItemController } from "@controller/itemController";
import { getItemRepository } from "@repository/itemRepository";
import { ItemService } from "@service/itemService";

export const ItemControllerFactory = () => {
  const itemRepository = getItemRepository();
  const itemService = new ItemService(itemRepository);
  return new ItemController(itemService);
};
