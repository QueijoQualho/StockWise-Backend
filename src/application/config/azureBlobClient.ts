import { BlobServiceClient } from "@azure/storage-blob";
import env from "./env";

const blobServiceUrl = env.azure.url
const sasToken = env.azure.token

if (!blobServiceUrl || !sasToken) {
  throw new Error("Azure Storage URL or SAS token is not defined.");
}

const blobServiceClient = new BlobServiceClient(`${blobServiceUrl}?${sasToken}`);

export default blobServiceClient;
