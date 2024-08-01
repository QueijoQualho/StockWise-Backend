// src/controllers/itemControllerInterface.ts
import { Request, Response } from 'express';

export interface IItemController {
  getItem(req: Request, res: Response): void;
  getItemByID(req: Request, res: Response): void;
  createItem(req: Request, res: Response): void;
  updateItem(req: Request, res: Response): void;
  deleteItem(req: Request, res: Response): void;
}
