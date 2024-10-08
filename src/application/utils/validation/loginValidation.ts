import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { BadRequestError } from "@utils/errors";
import { badRequest } from "@utils/errors/httpErrors";
import { LoginDTO } from "@dto/user/loginDTO";

export const validateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const loginDTO = Object.assign(new LoginDTO(), req.body);
  const validationErrors = await validate(loginDTO);

  if (validationErrors.length > 0) {
    return badRequest(
      res,
      new BadRequestError(
        "Validation failed",
        formatValidationErrors(validationErrors),
      ),
    );
  }

  req.body = loginDTO;
  next();
};

const formatValidationErrors = (errors: ValidationError[]) => {
  return errors.flatMap((err) =>
    Object.entries(err.constraints || {}).map(([message]) => ({
      field: err.property,
      message,
    })),
  );
};
