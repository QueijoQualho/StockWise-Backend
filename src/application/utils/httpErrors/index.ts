import logger from "@config/logger";
import { ServerError, UnauthorizedError } from "@utils/errors";
import { Response } from "express";

export const badRequest = (res: Response, error: Error): void => {
  logger.error({ error }, 'Bad Request Error');
  res.status(400).json({ error: error.message });
};

export const serverError = (res: Response, error: Error): void => {
  logger.error({ error }, 'Server Error');
  res.status(500).json({ error: new ServerError(error.stack as string).message });
};

export const created = (res: Response, data: unknown): void => {
  res.status(201).json(data);
};

export const noContent = (res: Response): void => {
  res.status(204).send();
};

export const ok = (res: Response, data: unknown): void => {
  res.status(200).json(data);
};

 
export const unauthorized = (res: Response, error: Error): void => {
  logger.warn({ error }, 'Unauthorized Error');
  res.status(401).json({ error: new UnauthorizedError().message });
};

export const forbidden = (res: Response, error: Error): void => {
  logger.warn({ error }, 'Forbidden Error');
  res.status(403).json({ error: error.message });
};

export const notFound = (res: Response, error: Error): void => {
  logger.warn({ error }, 'Not Found Error');
  res.status(404).json({ error: error.message });
};
