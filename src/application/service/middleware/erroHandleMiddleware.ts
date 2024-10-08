import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "@utils/errors";
import { serverError, badRequest, notFound } from "@utils/errors/httpErrors";

export const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
) => {
  if (err instanceof BadRequestError) {
    return badRequest(res, err);
  }
  if (err instanceof NotFoundError) {
    return notFound(res, err);
  }
  return serverError(res, err);
};
