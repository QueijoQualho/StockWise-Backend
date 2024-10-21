import env from "@config/env";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export default async function runPythonScript(
  scriptPath: string,
  filePath?: Express.Multer.File
): Promise<any> {
  try {
    const command =
      env.nodeEnv === "production"
        ? "/usr/src/app/python/venv/bin/python"
        : "python\\venv\\Scripts\\python";
    // Passa o arquivo como argumento para o script Python
    const { stdout, stderr } = await execPromise(`${command} ${scriptPath} ${filePath ? filePath : ""}`);
    if (stderr) {
      throw new Error(`stderr: ${stderr}`);
    }

    try {
      const result = JSON.parse(stdout);
      return result;
    } catch (parseError: any) {
      throw new Error(`Failed to parse JSON: ${parseError.message}`);
    }
  } catch (error: any) {
    throw new Error(`Error: ${error.message}`);
  }
}

