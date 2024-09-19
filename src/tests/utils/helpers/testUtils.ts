import { BadRequestError } from "@utils/errors";
import { Response } from "express";

export const expectErrorHandling = (
  res: Partial<Response>,
  expectedStatus: number,
  mockError: Error,
) => {
  const errorResponse = {
    message: mockError.message,
    status: expectedStatus,
  };

  if (mockError instanceof BadRequestError) {
    Object.assign(errorResponse, { details: mockError.details });
  }

  expect(res.status).toHaveBeenCalledWith(expectedStatus);
  expect(res.json).toHaveBeenCalledWith(errorResponse);
};
