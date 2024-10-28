import { SalaService } from "@service/salaService";
import { BadRequestError, NotFoundError } from "@utils/errors";
import { noContent, ok } from "@utils/errors/httpErrors";
import { PaginationParams } from "@utils/interfaces";
import { NextFunction, Request, Response } from "express";

export class SalaController {
  constructor(private readonly salaService: SalaService) {}

  // ======================================
  // = CRUD =
  // ======================================

  async getSalas(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const salas = await this.salaService.findAll();
      ok(res, salas);
    } catch (error) {
      next(error);
    }
  }

  async getSalasPaginated(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const pagination = this.extractPaginationParams(req.query);
      const salas = await this.salaService.getPaginatedSalas(pagination);
      ok(res, salas);
    } catch (error) {
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
    } catch (error) {
      next(error);
    }
  }

  async getItensSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const localizacao = this.extractSalaId(req.params.id);
    if (!localizacao) return next(new BadRequestError("Invalid sala ID"));

    try {
      const pagination = this.extractPaginationParams(req.query);
      const itens = await this.salaService.getPaginatedItensSala(
        localizacao,
        pagination,
      );
      ok(res, itens);
    } catch (error) {
      next(error);
    }
  }

  async getRelatoriosSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const localizacao = this.extractSalaId(req.params.id);
    if (!localizacao) return next(new BadRequestError("Invalid sala ID"));

    try {
      const pagination = this.extractPaginationParams(req.query);
      const dataLimite = this.extractDateParam(req.query.dataCriacao as string);

      const relatorios = await this.salaService.getRelatoriosSala(
        localizacao,
        pagination,
        dataLimite,
      );
      return relatorios.data.length > 0 ? ok(res, relatorios) : noContent(res);
    } catch (error) {
      next(error);
    }
  }

  async getAllRelatorios(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {

      const pagination = this.extractPaginationParams(req.query);
      const dataLimite = this.extractDateParam(req.query.dataCriacao as string);

      const relatorios = await this.salaService.getAllRelatoriosSala(pagination, dataLimite);
      return relatorios.data.length > 0 ? ok(res, relatorios) : noContent(res);
    } catch (error) {
      next(error);
    }
  }

  async uploadPDF(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const salaLocalizacao = this.extractSalaId(req.params.id);
    if (!salaLocalizacao) return next(new BadRequestError("Invalid sala ID"));

    try {
      await this.salaService.uploadPDF(salaLocalizacao, req.file);
      ok(res, "PDF sent successfully");
    } catch (error) {
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
      noContent(res);
    } catch (error) {
      next(error);
    }
  }

  // ======================================
  // = HELPER METHODS =
  // ======================================

  private extractSalaId(id: string): number | null {
    return !isNaN(Number(id)) ? parseInt(id, 10) : null;
  }

  private extractPaginationParams(query: any): PaginationParams {
    return {
      page: parseInt(query.page as string, 10) || 1,
      limit: parseInt(query.limit as string, 10) || 10,
    };
  }

  private extractDateParam(dateString?: string): Date | undefined {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new BadRequestError(
        "Invalid date format for dataLimite. Use YYYY-MM-DD",
      );
    }
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
