import { Request } from 'express';

export const isPublicRoute = (req: Request): boolean => {
  const path = req.originalUrl || req.path;

  const publicRoutes = ['/api/auth/login', '/api/auth/signup'];

  return publicRoutes.some(route => path.startsWith(route));
};
