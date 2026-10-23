import fs from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

export async function ensureUploadDirectory(folder = "general") {
  const directory = path.join(UPLOAD_ROOT, folder);

  await fs.mkdir(directory, {
    recursive: true,
  });

  return directory;
}

export function getUploadPath(
  folder: string,
  filename: string,
) {
  return path.join(UPLOAD_ROOT, folder, filename);
}

export function getPublicUrl(
  folder: string,
  filename: string,
) {
  return `/uploads/${folder}/${filename}`;
}

export async function deleteStoredFile(
  folder: string,
  filename: string,
) {
  const filePath = getUploadPath(folder, filename);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    const code =
      error &&
      typeof error === "object" &&
      "code" in error
        ? error.code
        : undefined;

    if (code !== "ENOENT") {
      throw error;
    }
  }
}