import { FileEntity } from "../entities/file.entity";
import { Folder } from "src/folders/entities/folder.entity";
import { User } from "src/user/entities/user.entity";

export abstract class IFileRepository {
    /**
     * Upload or create a new file record
     */
    abstract createFile(file: FileEntity): Promise<FileEntity>;

    /**
     * Update file metadata (e.g., name, version)
     */
    abstract updateFile(id: string, partial: Partial<FileEntity>): Promise<FileEntity | null>;

    /**
     * Delete a file by its ID
     */
    abstract deleteFile(id: string): Promise<void>;

    /**
     * Find a file by ID
     */
    abstract findById(id: string): Promise<FileEntity | null>;

    /**
     * Get all files inside a specific folder with pagination
     */
    abstract findByFolder(
        folder: Folder,
        page?: number,
        limit?: number,
    ): Promise<{ data: FileEntity[]; total: number; page: number; limit: number }>;

    /**
     * Get all files uploaded by a specific user with pagination
     */
    abstract findByUploader(
        uploader: User,
        page?: number,
        limit?: number,
    ): Promise<{ data: FileEntity[]; total: number; page: number; limit: number }>;

    /**
     * Search files by name or metadata
     */
    abstract search(
        query: string,
        page?: number,
        limit?: number,
    ): Promise<{ data: FileEntity[]; total: number; page: number; limit: number }>;

    /**
     * Check if a file exists by ID
     */
    abstract exists(id: string): Promise<boolean>;
}
