import env from "@config/env";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execPromise = promisify(exec);

export default async function runPythonScript(
  scriptPath: string,
  file?: Express.Multer.File,
): Promise<any> {
  try {
    const command =
      env.nodeEnv === "production"
        ? "/usr/src/app/python/venv/bin/python"
        : "python\\venv\\Scripts\\python";

    let filePath = "";
    const tempDir = path.join(process.cwd(), "temp");

    if (file) {
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      filePath = path.join(tempDir, file.originalname);
      fs.writeFileSync(filePath, file.buffer);
    }

    const { stdout, stderr } = await execPromise(
      `${command} ${scriptPath} ${filePath}`,
    );

    if (stderr) {
      throw new Error(`stderr: ${stderr}`);
    }

    try {
      const result = JSON.parse(stdout);
      return result;
    } catch (parseError: any) {
      throw new Error(`Failed to parse JSON: ${parseError.message}`);
    } finally {
      if (filePath) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (error: any) {
    throw new Error(`Error: ${error.message}`);
  }
}
