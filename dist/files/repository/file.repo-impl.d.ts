import { Repository } from "typeorm";
import { FileEntity } from "../entities/file.entity";
import { Folder } from "src/folders/entities/folder.entity";
import { User } from "src/user/entities/user.entity";
import { IFileRepository } from "./file.repo";
export declare class FileRepository implements IFileRepository {
    private readonly repo;
    constructor(repo: Repository<FileEntity>);
    createFile(file: FileEntity): Promise<FileEntity>;
    updateFile(id: string, partial: Partial<FileEntity>): Promise<FileEntity | null>;
    deleteFile(id: string): Promise<void>;
    findById(id: string): Promise<FileEntity | null>;
    findByFolder(folder: Folder, page?: number, limit?: number): Promise<{
        data: FileEntity[];
        total: number;
        page: number;
        limit: number;
    }>;
    findByUploader(uploader: User, page?: number, limit?: number): Promise<{
        data: FileEntity[];
        total: number;
        page: number;
        limit: number;
    }>;
    findByFolderAndUploader(folderId: string, uploaderId?: string, pageNumber?: number, limit?: number, filters?: {
        mimeType?: string;
        keyWord?: string;
        dateFrom?: Date;
        dateTo?: Date;
        minSize?: number;
        maxSize?: number;
    }, sort?: {
        sortBy?: 'createdAt' | 'name' | 'size';
        sortOrder?: 'ASC' | 'DESC';
    }): Promise<{
        data: FileEntity[];
        meta: {
            total: number;
            currentPage: number;
            totalPages: number;
        };
    }>;
    search(query: string, page?: number, limit?: number): Promise<{
        data: FileEntity[];
        total: number;
        page: number;
        limit: number;
    }>;
    exists(id: string): Promise<boolean>;
}
