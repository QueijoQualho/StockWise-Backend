import env from "@config/env";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export default async function runPythonScript(
  scriptPath: string,
): Promise<any> {
  try {
    const comand =
      env.nodeEnv === "production"
        ? "/usr/src/app/python/venv/bin/python"
        : "python\\venv\\Scripts\\python";
    const { stdout, stderr } = await execPromise(`${comand} ${scriptPath}`);
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
