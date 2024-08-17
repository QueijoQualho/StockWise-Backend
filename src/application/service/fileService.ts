import { BadRequestError } from "@utils/errors";
import fs from "fs";
import path from "path";
import { ItemService } from "./itemService";

export class FileService {
  private readonly uploadsDir = path.resolve(__dirname, "../../../uploads");

  async handleFileUpload(file: Express.Multer.File): Promise<string | null> {
    const filePath = file.path;
    if (this.fileExists(filePath)) {
      return this.generateFileUrl(filePath);
    }
    return null;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const filePath = this.resolveFilePath(fileUrl);
    await this.deleteFileIfExists(filePath);
  }

  async processFileHandling(
    file: Express.Multer.File | undefined,
    itemId?: number,
    itemService?: ItemService,
  ): Promise<string | BadRequestError> {
    if (!file) return "";

    const fileUrl = await this.handleFileUpload(file);
    if (!fileUrl) return new BadRequestError("Error processing file");

    if (itemId && itemService) {
      const existingItem = await itemService.findOne(itemId);
      if (existingItem && existingItem.url) {
        await this.deleteFile(existingItem.url);
      }
    }

    return fileUrl;
  }

  private async deleteFileIfExists(filePath: string): Promise<void> {
    if (this.fileExists(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error: any) {
        throw new BadRequestError(`Failed to delete file: ${error.message}`);
      }
    }
  }

  private fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  private generateFileUrl(filePath: string): string {
    return `/uploads/${path.basename(filePath)}`;
  }

  private resolveFilePath(fileUrl: string): string {
    return path.resolve(this.uploadsDir, path.basename(fileUrl));
  }
}
