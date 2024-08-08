/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";
import moment from "moment";

export function IsDateFormat(
  format: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isDateFormat",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== "string") return false;
          return moment(value, format, true).isValid();
        },
        defaultMessage(args: ValidationArguments) {
          return `A data deve estar no formato ${format}.`;
        },
      },
    });
  };
}
