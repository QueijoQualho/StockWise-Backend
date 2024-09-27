import { ItemController } from "@controller/itemController";
import { SalaController } from "@controller/salaController";
import { SeedController } from "@controller/seedController";
import { getItemRepository } from "@infra/repository/itemRepository";
import { getSalaRepository } from "@infra/repository/salaRepository";
import { FileService } from "@service/fileService";
import { ItemService } from "@service/itemService";
import { SalaService } from "@service/salaService";
import { SeedService } from "@service/seedService";

class ControllerFactory {
  private itemRepository = getItemRepository();
  private salaRepository = getSalaRepository();
  private fileService = new FileService();

  createItemController(): ItemController {
    const itemService = new ItemService(
      this.itemRepository,
      this.fileService,
      this.salaRepository,
    );
    return new ItemController(itemService);
  }

  createSalaController(): SalaController {
    const salaService = new SalaService(this.salaRepository);
    return new SalaController(salaService);
  }

  createSeedController(): SeedController {
    const seedService = new SeedService(
      this.itemRepository,
      this.salaRepository,
    );
    return new SeedController(seedService);
  }
}

export const controllerFactory = new ControllerFactory();
