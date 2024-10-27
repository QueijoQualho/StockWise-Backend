/* eslint-disable @typescript-eslint/no-unused-vars */
import { deleteFromAzure, uploadToAzure } from "./azureBlobService";
import { BadRequestError } from "@utils/errors";

export class UploadService {
  constructor(
    private readonly containerNameItens = "imagens",
    private readonly containerNamePdf = "pdfs",
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    existingFileUrl?: string,
  ): Promise<string> {
    try {
      const fileUrl = await uploadToAzure(file, this.containerNameItens);

      if (existingFileUrl) {
        await this.deleteFile(existingFileUrl);
      }

      return fileUrl;
    } catch (error: any) {
      throw new BadRequestError("Error processing file upload");
    }
  }

  async uploadPdf(
    file: Express.Multer.File,
    existingFileUrl?: string,
  ): Promise<string> {
    try {
      const fileUrl = await uploadToAzure(file, this.containerNamePdf);

      if (existingFileUrl) {
        await this.deletePdf(existingFileUrl);
      }

      return fileUrl;
    } catch (error: any) {
      throw new BadRequestError("Error processing PDF upload");
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      await deleteFromAzure(fileUrl, this.containerNameItens);
    } catch (error: any) {
      throw new BadRequestError("Error deleting file");
    }
  }

  async deletePdf(fileUrl: string): Promise<void> {
    try {
      await deleteFromAzure(fileUrl, this.containerNamePdf);
    } catch (error: any) {
      throw new BadRequestError("Error deleting PDF");
    }
  }
}
