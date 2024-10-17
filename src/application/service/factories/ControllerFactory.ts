import { AuthController } from "@controller/authController";
import { ItemController } from "@controller/itemController";
import { SalaController } from "@controller/salaController";
import { SeedController } from "@controller/seedController";
import { UserController } from "@controller/userController";
import { getItemRepository } from "@infra/repository/itemRepository";
import { getSalaRepository } from "@infra/repository/salaRepository";
import { getUserRepository } from "@infra/repository/userRepository";
import { AuthService } from "@service/authService";
import { ItemService } from "@service/itemService";
import { SalaService } from "@service/salaService";
import { SeedService } from "@service/seedService";
import { UploadService } from "@service/uploadService";
import { UserService } from "@service/userService";

class ControllerFactory {
  private itemRepository = getItemRepository();
  private salaRepository = getSalaRepository();
  private userRepository = getUserRepository();

  createItemController(): ItemController {
    const uploadService = new UploadService()
    const itemService = new ItemService(
      this.itemRepository,
      this.salaRepository,
      uploadService
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

  createAuthController(): AuthController {
    const authService = new AuthService(this.userRepository);
    return new AuthController(authService);
  }

  createUserController(): UserController {
    const userService = new UserService(this.userRepository)
    return new UserController(userService);
  }
}
export const controllerFactory = new ControllerFactory();
