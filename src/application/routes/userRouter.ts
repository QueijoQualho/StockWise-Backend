import { controllerFactory } from "@service/factories/ControllerFactory";
import { adminGuard } from "@service/middleware/roleGuard";
import { NextFunction, Router, Request, Response } from "express";

export default (router: Router): void => {
  const userController = controllerFactory.createUserController();

  router.use("/users", adminGuard.checkRole())

  router.get("/users", (req: Request, res: Response, next: NextFunction) => {
    userController.getUsersPaginated(req, res, next);
  });

  router.get(
    "/users/:id",
    (req: Request, res: Response, next: NextFunction) => {
      userController.getUserById(req, res, next);
    },
  );

  router.patch(
    "/users/:id",
    (req: Request, res: Response, next: NextFunction) => {
      userController.updateUser(req, res, next);
    },
  );

  router.delete(
    "/users/:id",
    (req: Request, res: Response, next: NextFunction) => {
      userController.deleteUser(req, res, next);
    },
  );
};
