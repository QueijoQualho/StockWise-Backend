import { controllerFactory } from "@utils/factory/ControllerFactory";
import { Router } from "express";

export default (router: Router): void => {
 const seedController = controllerFactory.createSeedController()
}
