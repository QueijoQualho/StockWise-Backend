import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { BadRequestError } from "@utils/errors";
import { ItemDTO, ItemUpdateDTO } from "@dto/index";
import { badRequest } from "@utils/httpErrors";
import fs from "fs";
import logger from "@config/logger";

export const validateCreateItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const itemDTO = Object.assign(new ItemDTO(), req.body);
  const validationErrors = await validate(itemDTO);

  if (validationErrors.length > 0) {
    if (req.file) deleteTemporaryFile(req.file.path);
    return badRequest(
      res,
      new BadRequestError(
        "Validation failed",
        formatValidationErrors(validationErrors),
      ),
    );
  }

  req.body = itemDTO;
  next();
};

export const validateUpdateItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const itemUpdateDTO = Object.assign(new ItemUpdateDTO(), req.body);
  const validationErrors = await validate(itemUpdateDTO);

  if (validationErrors.length > 0) {
    if (req.file) deleteTemporaryFile(req.file.path);
    return badRequest(
      res,
      new BadRequestError(
        "Validation failed",
        formatValidationErrors(validationErrors),
      ),
    );
  }

  req.body = itemUpdateDTO;
  next();
};

const deleteTemporaryFile = (filePath: string) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      logger.error({ err }, "Error deleting temporary file");
    }
  });
};

const formatValidationErrors = (errors: ValidationError[]) => {
  return errors.flatMap((err) =>
    Object.entries(err.constraints || {}).map(([message]) => ({
      field: err.property,
      message,
    })),
  );
};
