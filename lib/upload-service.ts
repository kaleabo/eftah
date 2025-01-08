import path from "path";
import sharp from "sharp";
import crypto from "crypto";
import * as ftp from "basic-ftp";
import { Readable } from "stream";

// Configuration
const CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"],
  FTP_HOST: process.env.FTP_HOST || '',
  FTP_USER: process.env.FTP_USER || '',
  FTP_PASSWORD: process.env.FTP_PASSWORD || '',
  FTP_UPLOAD_DIR: process.env.FTP_UPLOAD_DIR || '',
  PUBLIC_URL: process.env.FTP_PUBLIC_URL || '',
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Function to generate a secure random filename
async function generateSecureFilename(originalFilename: string): Promise<string> {
  const fileExtension = path.extname(originalFilename);
  const randomString = crypto.randomBytes(16).toString("hex");
  return `eftah-${Date.now()}-${randomString}${fileExtension}`;
}

// Function to validate file
function validateFile(file: File): void {
  if (file.size > CONFIG.MAX_FILE_SIZE) {
    throw new Error("File size exceeds the maximum limit of 10MB");
  }

  const fileExtension = path.extname(file.name).toLowerCase();
  if (!CONFIG.ALLOWED_EXTENSIONS.includes(fileExtension)) {
    throw new Error("Only JPG, PNG and WebP files are allowed");
  }
}

async function connectWithRetry(client: ftp.Client, retries = 0): Promise<void> {
  try {
    await client.access({
      host: CONFIG.FTP_HOST,
      user: CONFIG.FTP_USER,
      password: CONFIG.FTP_PASSWORD,
      secure: false,
    });
    // Test connection
    await client.pwd();
  } catch (error) {
    if (retries < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectWithRetry(client, retries + 1);
    }
    throw new Error('Failed to connect to FTP server after multiple retries. Please check your configuration.');
  }
}

export async function saveFile(file: File): Promise<string> {
  try {
    validateFile(file);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueFilename = await generateSecureFilename(file.name);

    // Compress and resize the image using Sharp
    const imageBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .resize({ width: 1000, height: 1000, fit: "inside" })
      .toBuffer();

    // Initialize FTP client
    const client = new ftp.Client();
    client.ftp.verbose = process.env.NODE_ENV === 'development';

    try {
      await connectWithRetry(client);

      // Create a readable stream from the image buffer
      const imageStream = new Readable({
        read() {
          this.push(imageBuffer);
          this.push(null);
        },
      });

      await client.ensureDir(CONFIG.FTP_UPLOAD_DIR);
      await client.uploadFrom(
        imageStream,
        path.posix.join(CONFIG.FTP_UPLOAD_DIR, uniqueFilename)
      );

      return `${CONFIG.PUBLIC_URL}/${uniqueFilename}`;
    } finally {
      client.close();
    }
  } catch (error) {
    console.error("Error in saveFile:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to save file. Please check FTP configuration.");
  }
}

export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    const filename = path.basename(fileUrl);
    const client = new ftp.Client();
    client.ftp.verbose = process.env.NODE_ENV === 'development';

    try {
      await connectWithRetry(client);

      const filePath = path.posix.join(CONFIG.FTP_UPLOAD_DIR, filename);
      
      if (await fileExistsOnFTP(client, filePath)) {
        await client.remove(filePath);
      }
    } finally {
      client.close();
    }
  } catch (error) {
    console.error("Error in deleteFile:", error);
    throw new Error("Failed to delete file. Please check FTP configuration.");
  }
}

async function fileExistsOnFTP(
  client: ftp.Client,
  filePath: string
): Promise<boolean> {
  try {
    await client.size(filePath);
    return true;
  } catch {
    return false;
  }
}