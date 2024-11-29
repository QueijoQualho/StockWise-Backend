import { AuthController } from "@controller/authController";
import { ItemController } from "@controller/itemController";
import { SalaController } from "@controller/salaController";
import { SeedController } from "@controller/seedController";
import { UserController } from "@controller/userController";
import { getItemRepository, ItemRepositoryType } from "@infra/repository/itemRepository";
import { getRelatorioRepository, RelatorioRepositoryType } from "@infra/repository/relatorioRepository";
import { getSalaRepository, SalaRepositoryType } from "@infra/repository/salaRepository";
import { getUserRepository, UserRepositoryType } from "@infra/repository/userRepository";
import { AuthService } from "@service/auth/authService";
import { ItemService } from "@service/itemService";
import { SalaService } from "@service/salaService";
import { SeedService } from "@service/seedService";
import { UploadService } from "@service/uploadService";
import { UserService } from "@service/userService";

class ControllerFactory {
  constructor(
    private readonly itemRepository: ItemRepositoryType,
    private readonly salaRepository: SalaRepositoryType,
    private readonly userRepository: UserRepositoryType,
    private readonly relatorioRepository: RelatorioRepositoryType,
  ) { }

  createItemController(): ItemController {
    const uploadService = new UploadService();
    const itemService = new ItemService(
      this.itemRepository,
      this.salaRepository,
      uploadService,
    );
    return new ItemController(itemService);
  }

  createSalaController(): SalaController {
    const uploadService = new UploadService();

    const salaService = new SalaService(
      this.salaRepository,
      this.relatorioRepository,
      uploadService,
    );
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
    const userRepository = getUserRepository();
    const userService = new UserService(userRepository);
    const authService = new AuthService(userService);
    return new AuthController(authService);
  }

  createUserController(): UserController {
    const userService = new UserService(this.userRepository);
    return new UserController(userService);
  }
}

const itemRepository = getItemRepository();
const salaRepository = getSalaRepository();
const userRepository = getUserRepository();
const relatorioRepository = getRelatorioRepository();

export const controllerFactory = new ControllerFactory(
  itemRepository,
  salaRepository,
  userRepository,
  relatorioRepository,
);
