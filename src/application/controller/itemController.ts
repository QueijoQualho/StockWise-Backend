// src/controllers/itemController.ts
import { Request, Response } from 'express';
import { Item } from '@model/itemEntity';
import { IItemController } from '@interfaces/controller/itemControllerInterface';
import { IItemService } from '@interfaces/service/itemServiceInterface';

export class ItemController implements IItemController {
  private itemService: IItemService;

  constructor(itemService: IItemService) {
    this.itemService = itemService;
  }

  async getItem(_: Request, res: Response): Promise<void> {
    try {
      const items = await this.itemService.getItem();
      res.json(items);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getItemByID(req: Request, res: Response): Promise<void> {
    try {
      const itemId = parseInt(req.params.id, 10);
      const item = await this.itemService.getItemByID(itemId);
      res.json(item);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async createItem(req: Request, res: Response): Promise<void> {
    try {
      const newItem: Item = req.body;
      await this.itemService.createItem(newItem);
      res.status(201).send('Item created');
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async updateItem(req: Request, res: Response): Promise<void> {
    try {
      const itemId = parseInt(req.params.id, 10);
      const updatedItem: Item = req.body;
      await this.itemService.updateItem(itemId, updatedItem);
      res.send('Item updated');
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async deleteItem(req: Request, res: Response): Promise<void> {
    try {
      const itemId = parseInt(req.params.id, 10);
      await this.itemService.deleteItem(itemId);
      res.send('Item deleted');
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
