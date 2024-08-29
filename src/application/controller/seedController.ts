/* eslint-disable no-prototype-builtins */
import { Request, Response } from "express";
import { SeedService } from "@service/seedService";
import runPythonScript from "@utils/functions/runPythonScript";
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

  async seedSalas(req: Request, res: Response): Promise<Response> {
    try {
      const scriptPath = path.resolve(__dirname + "../../../../python/seeder.py");
      const requirementsPath = path.resolve(__dirname + "../../../../python/requirements.txt");
      const output: Output = await runPythonScript(scriptPath, requirementsPath);

      for (const sala_id in output) {
        if (output.hasOwnProperty(sala_id)) {
          const dados_sala = output[sala_id];

          await this.seedService.saveSala(dados_sala)
        }
      }

      return res.status(200).json({ message: 'Salas processadas com sucesso!', output });
    } catch (error: any) {
      // Retornar uma resposta de erro
      return res.status(500).json({ error: 'Erro ao processar as salas', details: error.message });
    }
  }
}
