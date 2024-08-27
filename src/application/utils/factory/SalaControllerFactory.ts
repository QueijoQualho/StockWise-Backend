import { SalaController } from "@controller/salaController";
import { getItemRepository } from "@repository/itemRepository";
import { getSalaRepository } from "@repository/salaRepository";
import { SalaService } from "@service/salaService";

export const salaControllerFactory = () => {
  const salaRepository = getSalaRepository();
  const itemRepository = getItemRepository();
  const salaService = new SalaService(salaRepository, itemRepository);
  return new SalaController(salaService);
};
