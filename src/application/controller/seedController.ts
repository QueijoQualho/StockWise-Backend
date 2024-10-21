/* eslint-disable no-prototype-builtins */
import { SeedService } from "@service/seedService";
import { created } from "@utils/errors/httpErrors";
import runPythonScript from "@utils/functions/runPythonScript";
import { NextFunction, Request, Response } from "express";
import path from "path";

interface Item {
  id: number;
  denominacao: string;
  dataDeIncorporacao: string;
}

interface Sala {
  localizacao: number;
  quantidadeDeItens: number;
  Sala: string;
  items: Item[];
}

type Output = Record<string, Sala>;

export class SeedController {
  constructor(private readonly seedService: SeedService) { }

  async seedSalas(
    _: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const scriptPath = path.resolve(
        __dirname + "../../../../python/seeder.py",
      );
      const output: Output = await runPythonScript(scriptPath);

      for (const sala_id in output) {
        if (output.hasOwnProperty(sala_id)) {
          const dados_sala = output[sala_id];

          await this.seedService.saveSala(dados_sala);
        }
      }

      return created(res, "Tabela povoada")
    } catch (error: any) {
      next(error);
    }
  }

  async createItemsFromFile(
    req: Request,
    res: Response,
    next: NextFunction,) {
    try {
      const scriptPath = path.resolve(
        __dirname + "../../../../python/model.py",
      );
      const output: Output = await runPythonScript(scriptPath, req.file);

      for (const sala_id in output) {
        if (output.hasOwnProperty(sala_id)) {
          const dados_sala = output[sala_id];

          await this.seedService.saveSala(dados_sala);
        }
      }
    } catch (error: any) {
      next(error);
    }
  }
}
