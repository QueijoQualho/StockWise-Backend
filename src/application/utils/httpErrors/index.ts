import logger from "@config/logger";
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from "@utils/errors";
import { Response } from "express";

interface ErrorResponse {
  status: number;
  message: string;
  details?: { field: string; message: string }[];
}

export const badRequest = (res: Response, error: BadRequestError): void => {
  logger.error({ error }, "Bad Request Error");
  res.status(400).json({
    status: 400,
    message: error.message,
    details: error.details,
  } as ErrorResponse);
};

export const serverError = (res: Response, error: any): void => {
  logger.error({ error }, "Server Error");
  res.status(500).json({
    status: 500,
    message: "Internal server error",
  } as ErrorResponse);
};

export const created = (res: Response, data: any): void => {
  res.status(201).json(data);
};

export const noContent = (res: Response): void => {
  res.status(204).send();
};

export const ok = (res: Response, data: any): void => {
  res.status(200).json(data);
};

export const unauthorized = (res: Response, error: UnauthorizedError): void => {
  logger.warn({ error }, "Unauthorized Error");
  res.status(401).json({
    status: 401,
    message: error.message,
  } as ErrorResponse);
};

export const forbidden = (res: Response, error: ForbiddenError): void => {
  logger.warn({ error }, "Forbidden Error");
  res.status(403).json({
    status: 403,
    message: error.message,
  } as ErrorResponse);
};

export const notFound = (res: Response, error: NotFoundError): void => {
  logger.warn({ error }, "Not Found Error");
  res.status(404).json({
    status: 404,
    message: error.message,
  } as ErrorResponse);
};
