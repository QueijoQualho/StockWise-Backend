import { SalaController } from "@controller/salaController";
import { getSalaRepository } from "@repository/salaRepository";
import { SalaService } from "@service/salaService";

export const salaControllerFactory = () => {
  const salaRepository = getSalaRepository();
  const salaService = new SalaService(salaRepository);
  return new SalaController(salaService);
};
