import { ItemController } from "@controller/itemController";
import { getItemRepository } from "@repository/itemRepository";
import { FileService } from "@service/fileService";
import { ItemService } from "@service/itemService";

export const ItemControllerFactory = () => {
  const itemRepository = getItemRepository();
  const fileService = new FileService();
  const itemService = new ItemService(itemRepository, fileService);
  return new ItemController(itemService);
};
