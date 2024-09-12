import { SalaUpdateDTO } from "@dto/index";
import { SalaService } from "@service/salaService";
import { BadRequestError, NotFoundError } from "@utils/errors";
import {
  badRequest,
  noContent,
  notFound,
  ok,
  serverError
} from "@utils/httpErrors";
import { PaginationParams } from "@utils/interfaces";
import { Request, Response } from "express";

export class SalaController {
  constructor(private readonly salaService: SalaService) { }

  // ======================================
  // = CRUD =
  // ======================================

  async getSala(req: Request, res: Response): Promise<void> {
    try {
      const pagination: PaginationParams = {
        page: parseInt(req.query.page as string, 10) || 1,
        limit: parseInt(req.query.limit as string, 10) || 10,
      };

      const salas = await this.salaService.getPaginatedSalas(pagination);
      return ok(res, salas);
    } catch (error: any) {
      if (error instanceof NotFoundError) return noContent(res);
      return serverError(res, error);
    }
  }

  async getSalaByID(req: Request, res: Response): Promise<void> {
    const salaId = this.extractSalaId(req.params.id);
    if (!salaId) return badRequest(res, new BadRequestError("Invalid sala ID"));

    try {
      const sala = await this.salaService.findOne(salaId);
      return sala
        ? ok(res, sala)
        : notFound(res, new NotFoundError("Sala not found"));
    } catch (error: any) {
      return serverError(res, error);
    }
  }

  // async createSala(req: Request, res: Response): Promise<void> {
  //   const salaDTO = Object.assign(new SalaDTO(), req.body);

  //   try {
  //     const result = await this.salaService.create(salaDTO);
  //     return created(res, result);
  //   } catch (error: any) {
  //     if (error instanceof BadRequestError) return badRequest(res, error);
  //     return serverError(res, error);
  //   }
  // }

  async updateSala(req: Request, res: Response): Promise<void> {
    const salaId = this.extractSalaId(req.params.id);
    if (!salaId) return badRequest(res, new BadRequestError("Invalid sala ID"));

    const updatedSalaDTO = Object.assign(new SalaUpdateDTO(), req.body);

    try {
      await this.salaService.update(salaId, updatedSalaDTO);
      return noContent(res);
    } catch (error: any) {
      if (error instanceof BadRequestError) return badRequest(res, error);
      if (error instanceof NotFoundError) return notFound(res, error);
      return serverError(res, error);
    }
  }

  async deleteSala(req: Request, res: Response): Promise<void> {
    const salaId = this.extractSalaId(req.params.id);
    if (!salaId) return badRequest(res, new BadRequestError("Invalid sala ID"));

    try {
      await this.salaService.delete(salaId);
      return noContent(res);
    } catch (error: any) {
      if (error instanceof NotFoundError) return notFound(res, error);
      return serverError(res, error);
    }
  }

  async getItensSala(req: Request, res: Response): Promise<void> {
    const salaLocalizacao = this.extractSalaId(req.params.id);
    if (!salaLocalizacao)
      return badRequest(res, new BadRequestError("Invalid sala ID"));
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
      if (error instanceof NotFoundError) return notFound(res, error);
      return serverError(res, error);
    }
  }

  // ======================================
  // = HELPER METHODS =
  // ======================================

  private extractSalaId = (id: string): number | null =>
    !isNaN(Number(id)) ? parseInt(id, 10) : null;
}
