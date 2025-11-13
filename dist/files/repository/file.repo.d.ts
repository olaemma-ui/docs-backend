import { FileEntity } from "../entities/file.entity";
import { Folder } from "src/folders/entities/folder.entity";
import { User } from "src/user/entities/user.entity";
export declare abstract class IFileRepository {
    abstract createFile(file: FileEntity): Promise<FileEntity>;
    abstract updateFile(id: string, partial: Partial<FileEntity>): Promise<FileEntity | null>;
    abstract deleteFile(id: string): Promise<void>;
    abstract findById(id: string): Promise<FileEntity | null>;
    abstract findByFolder(folder: Folder, page?: number, limit?: number): Promise<{
        data: FileEntity[];
        total: number;
        page: number;
        limit: number;
    }>;
    abstract findByUploader(uploader: User, page?: number, limit?: number): Promise<{
        data: FileEntity[];
        total: number;
        page: number;
        limit: number;
    }>;
    abstract search(query: string, page?: number, limit?: number): Promise<{
        data: FileEntity[];
        total: number;
        page: number;
        limit: number;
    }>;
    abstract exists(id: string): Promise<boolean>;
}
