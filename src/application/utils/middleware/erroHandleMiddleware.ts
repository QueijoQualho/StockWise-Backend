import { Request, Response, NextFunction } from "express";
import { BadRequestError, NotFoundError } from "@utils/errors";
import { serverError, badRequest, notFound } from "@utils/httpErrors";

export const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  if (err instanceof BadRequestError) {
    return badRequest(res, err);
  }
  if (err instanceof NotFoundError) {
    return notFound(res, err);
  }
  return serverError(res, err);
};
