export class BadRequestError extends Error {
  constructor(paramName: string) {
    super(`Bad request:${paramName}`);
    this.name = "BadRequestError";
  }
}
