import { controllerFactory } from "@service/factories/ControllerFactory";
import { NextFunction, Router, Request, Response } from "express";

export default (router:Router): void => {
  const userController = controllerFactory.createUserController();

  router.get("/users",(req: Request, res: Response, next: NextFunction) => {
    userController.getUsersPaginated(req, res, next);
  })
}
