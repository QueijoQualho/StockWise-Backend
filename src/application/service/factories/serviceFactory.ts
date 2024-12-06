import env from "@config/env";
import { getItemRepository, getRelatorioRepository, getSalaRepository, getUserRepository, ItemRepositoryType, RelatorioRepositoryType, SalaRepositoryType, UserRepositoryType } from "@infra/repository";
import { AuthService } from "@service/auth/authService";
import { JwtService } from "@service/auth/jwtService";
import { ItemService } from "@service/itemService";
import { SalaService } from "@service/salaService";
import { SeedService } from "@service/seedService";
import { UploadService } from "@service/uploadService";
import { UserService } from "@service/userService";

class ServiceFactory {
  private readonly uploadService: UploadService;
  private readonly itemService: ItemService;
  private readonly salaService: SalaService;
  private readonly seedService: SeedService;
  private readonly userService: UserService;
  private readonly authService: AuthService;

  constructor(
    private readonly itemRepository: ItemRepositoryType,
    private readonly salaRepository: SalaRepositoryType,
    private readonly userRepository: UserRepositoryType,
    private readonly relatorioRepository: RelatorioRepositoryType,
  ) {
    this.uploadService = new UploadService();
    this.itemService = new ItemService(this.itemRepository, this.salaRepository, this.uploadService);
    this.salaService = new SalaService(this.salaRepository, this.relatorioRepository, this.uploadService);
    this.seedService = new SeedService(this.itemRepository, this.salaRepository);
    this.userService = new UserService(this.userRepository);
    const jwtService = new JwtService(env.jwt_secret);
    this.authService = new AuthService(this.userService, jwtService);
  }

  getItemService(): ItemService {
    return this.itemService;
  }

  getSalaService(): SalaService {
    return this.salaService;
  }

  getSeedService(): SeedService {
    return this.seedService;
  }

  getAuthService(): AuthService {
    return this.authService;
  }

  getUserService(): UserService {
    return this.userService;
  }
}

const itemRepository = getItemRepository();
const salaRepository = getSalaRepository();
const userRepository = getUserRepository();
const relatorioRepository = getRelatorioRepository();

export const serviceFactory = new ServiceFactory(
  itemRepository,
  salaRepository,
  userRepository,
  relatorioRepository,
);
