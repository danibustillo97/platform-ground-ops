import { BlobServiceClient } from "@azure/storage-blob";


const AZURE_STORAGE_ACCOUNT_URL = "https://arajetstdatalake.blob.core.windows.net/odsgroundops"; 

let blobServiceClient: BlobServiceClient | null = null;

export const initializeBlobServiceClient = (blobSasToken: string) => {

  blobServiceClient = new BlobServiceClient(`${AZURE_STORAGE_ACCOUNT_URL}?${blobSasToken}`);
};

export const uploadImageToAzure = async (
  file: File | Blob,
  containerName: string,
  fileName: string
): Promise<string> => {
  try {
    if (!blobServiceClient) {
      throw new Error("El cliente de servicio de blobs no ha sido inicializado.");
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);

    const exists = await containerClient.exists();
    if (!exists) {
      throw new Error(`El contenedor '${containerName}' no existe.`);
    }

    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.uploadData(file, {
      blobHTTPHeaders: { blobContentType: file.type }
    });

    return blockBlobClient.url;
  } catch (error) {
    console.error("Error al subir la imagen a Azure:", error);
    throw new Error("No se pudo subir la imagen.");
  }
};
