import { exec } from "child_process";
import { promisify } from "util";

// Convert exec into a Promise-based function
const execPromise = promisify(exec);

async function installDependencies(requirementsPath: string): Promise<void> {
  try {
    await execPromise(`pip install -r ${requirementsPath}`);
  } catch (error: any) {
    throw new Error(`Failed to install dependencies: ${error.message}`);
  }
}

export default async function runPythonScript(scriptPath: string, requirementsPath: string): Promise<any> {
  try {
    // Ensure dependencies are installed
    await installDependencies(requirementsPath);

    // Run the Python script
    const { stdout, stderr } = await execPromise(`python ${scriptPath}`);
    if (stderr) {
      throw new Error(`stderr: ${stderr}`);
    }

    // Parse the JSON output
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
