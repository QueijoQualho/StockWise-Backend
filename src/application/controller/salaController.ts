import { SalaUpdateDTO } from "@dto/index";
import { SalaService } from "@service/salaService";
import { BadRequestError, NotFoundError } from "@utils/errors";
import { noContent, ok } from "@utils/httpErrors";
import { PaginationParams } from "@utils/interfaces";
import { NextFunction, Request, Response } from "express";

export class SalaController {
  constructor(private readonly salaService: SalaService) {}

  async getSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const pagination: PaginationParams = {
        page: parseInt(req.query.page as string, 10) || 1,
        limit: parseInt(req.query.limit as string, 10) || 10,
      };

      const salas = await this.salaService.getPaginatedSalas(pagination);
      return ok(res, salas);
    } catch (error: any) {
      next(error);
    }
  }

  async getSalaByID(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const salaId = this.extractSalaId(req.params.id);
    if (!salaId) return next(new BadRequestError("Invalid sala ID"));

    try {
      const sala = await this.salaService.findOne(salaId);
      return sala ? ok(res, sala) : next(new NotFoundError("Sala not found"));
    } catch (error: any) {
      next(error);
    }
  }

  async updateSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const salaId = this.extractSalaId(req.params.id);
    if (!salaId) return next(new BadRequestError("Invalid sala ID"));

    const updatedSalaDTO = Object.assign(new SalaUpdateDTO(), req.body);

    try {
      await this.salaService.update(salaId, updatedSalaDTO);
      return noContent(res);
    } catch (error: any) {
      next(error);
    }
  }

  async deleteSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const salaId = this.extractSalaId(req.params.id);
    if (!salaId) return next(new BadRequestError("Invalid sala ID"));

    try {
      await this.salaService.delete(salaId);
      return noContent(res);
    } catch (error: any) {
      next(error);
    }
  }

  async getItensSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const salaLocalizacao = this.extractSalaId(req.params.id);
    if (!salaLocalizacao) return next(new BadRequestError("Invalid sala ID"));

    try {
      const pagination: PaginationParams = {
        page: parseInt(req.query.page as string, 10) || 1,
        limit: parseInt(req.query.limit as string, 10) || 10,
      };

      const itens = await this.salaService.getPaginatedItensSala(
        salaLocalizacao,
        pagination,
      );
      return ok(res, itens);
    } catch (error: any) {
      next(error);
    }
  }

  private extractSalaId = (id: string): number | null =>
    !isNaN(Number(id)) ? parseInt(id, 10) : null;
}
