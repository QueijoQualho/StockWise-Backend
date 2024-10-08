import { controllerFactory } from "@utils/factory/ControllerFactory";
import { validateCreateItem } from "@validation/ItemValidation";
import { validateLogin } from "@validation/loginValidation";
import { Router, Request, Response, NextFunction } from "express";

export default (router: Router): void => {
  const authController = controllerFactory.createUserController();

  router.post(
    "/auth/login",
    validateLogin,
    (req: Request, res: Response, next: NextFunction) => {
      authController.login(req, res, next);
    },
  );

  router.post(
    "/auth/signup",
    validateCreateItem,
    (req: Request, res: Response, next: NextFunction) => {
      authController.signup(req, res, next);
    },
  );
};
