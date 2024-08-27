import { Request, Response } from "express";
import {
  ok,
  serverError,
  notFound,
  created,
  noContent,
  badRequest,
} from "@utils/httpErrors";
import { NotFoundError, BadRequestError } from "@utils/errors";
import { SalaService } from "@service/salaService";
import { SalaDTO, SalaUpdateDTO } from "@dto/index";

export class SalaController {
  constructor(private readonly salaService: SalaService) { }

  // ======================================
  // = CRUD =
  // ======================================

  async getSala(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const salas = await this.salaService.getPaginatedSalas(page, limit);
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

  async createSala(req: Request, res: Response): Promise<void> {
    const salaDTO = Object.assign(new SalaDTO(), req.body);

    try {
      const result = await this.salaService.create(salaDTO);
      return created(res, result);
    } catch (error: any) {
      if (error instanceof BadRequestError) return badRequest(res, error);
      return serverError(res, error);
    }
  }

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


  async saveSala(req: Request, res: Response): Promise<Response> {
    try {
      const dados = req.body;

      for (const key in dados) {
        await this.salaService.saveSala(dados[key]);
      }

      return res.status(201).json({ message: 'Salas salvas com sucesso!' });
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao salvar as salas', details: error.message });
    }
  }

  // ======================================
  // = HELPER METHODS =
  // ======================================

  private extractSalaId = (id: string): number | null =>
    !isNaN(Number(id)) ? parseInt(id, 10) : null;
}
