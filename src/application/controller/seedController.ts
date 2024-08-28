import { Request, Response } from "express";
import { SeedService } from "@service/seedService";
import runPythonScript from "@utils/functions/runPythonScript";

export class SeedController {
  constructor(private readonly seedService: SeedService) { }

  async seedSalas(req: Request, res: Response): Promise<Response> {
    try {
      const scriptPath = './path/to/your/python_script.py';
      const output = await runPythonScript(scriptPath);

      // Retornar uma resposta bem-sucedida
      return res.status(200).json({ message: 'Salas processadas com sucesso!', output });
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao processar as salas', details: error.message });
    }
  }
}
