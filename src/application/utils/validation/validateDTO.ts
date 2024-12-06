import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { BadRequestError } from "@utils/errors";
import { badRequest } from "@utils/errors/httpErrors";
import { ItemUpdateDTO, SalaDTO } from "@dto/index";
import { SignupDTO } from "@dto/user/signupDTO";
import { LoginDTO } from "@dto/user/loginDTO";

const validateDTO =
  (DTOClass: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = Object.assign(new DTOClass(), req.body);
    const validationErrors = await validate(dtoInstance);

    if (validationErrors.length > 0) {
      return badRequest(
        res,
        new BadRequestError(
          "Validation failed",
          formatValidationErrors(validationErrors),
        ),
      );
    }

    req.body = dtoInstance;
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

export const validateCreateSala = validateDTO(SalaDTO);
export const validateUpdateItem = validateDTO(ItemUpdateDTO);
export const validateCreateUser = validateDTO(SignupDTO);
export const validateLogin = validateDTO(LoginDTO);
