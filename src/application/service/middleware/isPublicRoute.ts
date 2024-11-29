import { Request } from 'express';

export const isPublicRoute = (req: Request): boolean => {
  return req.route && req.route.path && req.route.path.includes('/auth');
};
