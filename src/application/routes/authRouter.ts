import { controllerFactory } from "@service/factories/ControllerFactory";
import { validateCreateUser } from "@utils/validation/createUserValidation";
import { validateLogin } from "@utils/validation/loginValidation";
import { NextFunction, Request, Response, Router } from "express";

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
    validateCreateUser,
    (req: Request, res: Response, next: NextFunction) => {
      authController.signup(req, res, next);
    },
  );
};
