/* eslint-disable no-prototype-builtins */
import { SeedService } from "@service/seedService";
import runPythonScript from "@utils/functions/runPythonScript";
import { ok, serverError } from "@utils/httpErrors";
import { Request, Response } from "express";
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

  async seedSalas(_: Request, res: Response): Promise<void> {
    try {
      const scriptPath = path.resolve(__dirname + "../../../../python/seeder.py",);
      const requirementsPath = path.resolve(__dirname + "../../../../python/requirements.txt",);
      const output: Output = await runPythonScript(
        scriptPath,
        requirementsPath,
      );

      for (const sala_id in output) {
        if (output.hasOwnProperty(sala_id)) {
          const dados_sala = output[sala_id];

          await this.seedService.saveSala(dados_sala);
        }
      }

      ok(res, "Salas criadas com sucesso!");
    } catch (error: any) {
      serverError(res, error);
    }
  }
}
