import { SalaController } from "@controller/salaController";
import { serviceFactory } from "./serviceFactory";
import { ItemController } from "@controller/itemController";
import { SeedController } from "@controller/seedController";
import { AuthController } from "@controller/authController";
import { UserController } from "@controller/userController";

class ControllerFactory {

  createItemController(): ItemController {
    return new ItemController(serviceFactory.getItemService());
  }

  createSalaController(): SalaController {
    return new SalaController(serviceFactory.getSalaService());
  }

  createSeedController(): SeedController {
    return new SeedController(serviceFactory.getSeedService());
  }

  createAuthController(): AuthController {
    return new AuthController(serviceFactory.getAuthService());
  }

  createUserController(): UserController {
    return new UserController(serviceFactory.getUserService());
  }
}

export const controllerFactory = new ControllerFactory()
