import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { promises as fs } from 'fs';
import { join, resolve } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class SystemService {
  private readonly uploadsDir = join(process.cwd(), 'uploads');

  constructor() {
    this.findOrCreateUserDirectory(this.uploadsDir);
    console.log('uploadsDir', this.uploadsDir);
  }

  /**
   * Save a blob/buffer to the filesystem
   * @param blob - The file data as Buffer or Uint8Array
   * @param filename - The name of the file to save
   * @param subfolder - Optional subfolder within uploads directory
   * @returns The full path where the file was saved
   */
  public async saveBlob(
    blob: Buffer | Uint8Array,
    filename: string,
    subfolder?: string,
  ): Promise<string> {
    try {
      if (!blob || blob.length === 0) {
        throw new BadRequestException('Blob data cannot be empty');
      }

      if (!filename || filename.trim() === '') {
        throw new BadRequestException('Filename is required');
      }

      const sanitizedPath = this.sanitizePath(subfolder);
      const sanitizedFilename = this.sanitizeFilename(filename);

      const targetDir = sanitizedPath;

      const filePath = join(targetDir, sanitizedFilename);

      await fs.writeFile(filePath, blob);

      return filePath;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to save file: ${error.message}`);
    }
  }

  /**
   * Get folder contents by path
   * @returns Array of file/folder information
   */
  public async getFolderContents(): Promise<
    Array<{
      name: string;
      type: 'file' | 'directory';
      size?: number;
      modifiedAt: Date;
      path: string;
    }>
  > {
    try {
      const stats = await fs.stat(this.uploadsDir);
      if (!stats.isDirectory()) {
        throw new BadRequestException(
          `Path is not a directory: ${this.uploadsDir}`,
        );
      }

      const items = await fs.readdir(this.uploadsDir);
      const results = [];

      for (const item of items) {
        const itemPath = join(this.uploadsDir, item);
        const itemStats = await fs.stat(itemPath);

        results.push({
          name: item,
          type: itemStats.isDirectory() ? 'directory' : 'file',
          size: itemStats.isFile() ? itemStats.size : undefined,
          modifiedAt: itemStats.mtime,
          path: itemPath,
        });
      }

      return results.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to read folder: ${error.message}`);
    }
  }

  getUploadsDirectory(): string {
    return this.uploadsDir;
  }

  private async findOrCreateUserDirectory(dirPath: string): Promise<void> {
    const sanitizedPath = this.sanitizePath(dirPath);
    if (sanitizedPath !== dirPath) {
      throw new BadRequestException(
        `Invalid path: ${dirPath}, sanitized path: ${sanitizedPath}`,
      );
    }

    try {
      if (!existsSync(dirPath)) {
        await fs.mkdir(dirPath, { recursive: true });
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create user directory: ${error.message}`,
      );
    }
  }

  /**
   * Sanitize filename to prevent path traversal attacks
   */
  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace invalid chars with underscore
      .replace(/\.{2,}/g, '.') // Replace multiple dots with single dot
      .replace(/^\.+/, '') // Remove leading dots
      .replace(/\.+$/, ''); // Remove trailing dots
  }

  /**
   * Sanitize path to prevent path traversal attacks
   */
  private sanitizePath(path: string): string {
    return path
      .replace(/[^a-zA-Z0-9._/-]/g, '_') // Replace invalid chars
      .replace(/\.{2,}/g, '.') // Replace multiple dots
      .replace(/\/{2,}/g, '/'); // Replace multiple slashes
  }

  /**
   * Resolve folder path - can be relative to uploads or absolute
   */
  private resolveFolderPath(folderPath: string): string {
    // If it's an absolute path, use it directly
    if (folderPath.startsWith('/') || folderPath.match(/^[A-Za-z]:/)) {
      return resolve(folderPath);
    }

    // Otherwise, resolve relative to uploads directory
    return resolve(this.uploadsDir, folderPath);
  }
}
