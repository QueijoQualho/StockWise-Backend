import { ItemController } from "@controller/itemController";
import { getItemRepository } from "@repository/itemRepository";
import { getSalaRepository } from "@repository/salaRepository";
import { FileService } from "@service/fileService";
import { ItemService } from "@service/itemService";

export const itemControllerFactory = () => {
  const itemRepository = getItemRepository();
  const salaRepository = getSalaRepository();
  const fileService = new FileService();
  const itemService = new ItemService(itemRepository, fileService, salaRepository);
  return new ItemController(itemService);
};
