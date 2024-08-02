// src/controllers/itemController.ts
import { Request, Response } from 'express';
import { Item } from '@model/item.js';
import { IItemController } from '@interfaces/controller/itemControllerInterface.js';
import { IItemService } from '@interfaces/service/itemServiceInterface.js';

export class ItemController implements IItemController {
  private itemService: IItemService;

  constructor(itemService: IItemService) {
    this.itemService = itemService;
  }

  getItem(_: Request, res: Response): void {
    const items = this.itemService.getItem();
    res.json(items);
  }

  getItemByID(req: Request, res: Response): void {
    const itemId = parseInt(req.params.id, 10);
    const item = this.itemService.getItemByID(itemId);
    res.json(item);
  }

  createItem(req: Request, res: Response): void {
    const newItem: Item = req.body;
    this.itemService.createItem(newItem);
    res.status(201).send('Item created');
  }

  updateItem(req: Request, res: Response): void {
    const itemId = parseInt(req.params.id, 10);
    const updatedItem: Item = req.body;
    this.itemService.updateItem(itemId, updatedItem);
    res.send('Item updated');
  }

  deleteItem(req: Request, res: Response): void {
    const itemId = parseInt(req.params.id, 10);
    this.itemService.deleteItem(itemId);
    res.send('Item deleted');
  }
}
