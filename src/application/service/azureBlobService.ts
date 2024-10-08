import blobServiceClient from "@config/azureBlobClient";
import logger from "@config/logger";

const containerName = "imagens";

// Função para fazer upload de um arquivo para o Azure Blob Storage
export const uploadToAzure = async (file: Express.Multer.File): Promise<string> => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobName = `${Date.now()}_${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer);

    return blockBlobClient.url;
  } catch (error) {
    logger.error("Erro ao fazer upload para o Azure Blob Storage:", error);
    throw new Error("Erro ao fazer upload para o Azure Blob Storage.");
  }
};

// Função para deletar um arquivo do Azure Blob Storage
export const deleteFromAzure = async (fileUrl: string): Promise<void> => {
  try {
    const blobName = fileUrl.split("/").pop();
    if (!blobName) throw new Error("Nome do blob inválido");

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.deleteIfExists();
  } catch (error) {
    logger.error("Erro ao deletar blob do Azure Blob Storage:", error);
    throw new Error("Erro ao deletar blob do Azure Blob Storage.");
  }
};
