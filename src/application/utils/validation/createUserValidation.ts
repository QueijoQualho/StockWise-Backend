import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { BadRequestError } from "@utils/errors";
import { badRequest } from "@utils/errors/httpErrors";
import { SignupDTO } from "@dto/user/signupDTO";

export const validateCreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const signupDTO = Object.assign(new SignupDTO(), req.body);
  const validationErrors = await validate(signupDTO);

  if (validationErrors.length > 0) {
    return badRequest(
      res,
      new BadRequestError(
        "Validation failed",
        formatValidationErrors(validationErrors),
      ),
    );
  }

  req.body = signupDTO;
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
