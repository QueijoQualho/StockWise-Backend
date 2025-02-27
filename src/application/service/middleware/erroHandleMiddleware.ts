import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotFoundError } from "@utils/errors";
import { serverError, badRequest, notFound } from "@utils/errors/httpErrors";

export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (err instanceof BadRequestError) {
    return badRequest(res, err);
  }
  if (err instanceof NotFoundError) {
    return notFound(res, err);
  }
  return serverError(res, err);
};
