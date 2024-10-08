import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { BadRequestError } from "@utils/errors";
import { SalaDTO, SalaUpdateDTO } from "@dto/index";
import { badRequest } from "@utils/errors/httpErrors";

export const validateCreateSala = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const salaDTO = Object.assign(new SalaDTO(), req.body);
  const validationErrors = await validate(salaDTO);

  if (validationErrors.length > 0) {
    return badRequest(
      res,
      new BadRequestError(
        "Validation failed",
        formatValidationErrors(validationErrors),
      ),
    );
  }

  req.body = salaDTO;
  next();
};

export const validateUpdateSala = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const salaUpdateDTO = Object.assign(new SalaUpdateDTO(), req.body);
  const validationErrors = await validate(salaUpdateDTO);

  if (validationErrors.length > 0) {
    return badRequest(
      res,
      new BadRequestError(
        "Validation failed",
        formatValidationErrors(validationErrors),
      ),
    );
  }

  req.body = salaUpdateDTO;
  next();
};

const formatValidationErrors = (errors: ValidationError[]) => {
  return errors.flatMap((err) =>
    Object.entries(err.constraints || {}).map(([, message]) => ({
      field: err.property,
      message,
    })),
  );
};
