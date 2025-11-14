import { FindOneOptions, Repository } from "typeorm";
import { Folder } from '../entities/folder.entity';
import { IFolderRepository } from "./folder.repo";
import { FindFolderDto } from "../dto/find-folder.dto";
export declare class FolderRepository implements IFolderRepository {
    private readonly folderRepo;
    constructor(folderRepo: Repository<Folder>);
    findOne(options: FindOneOptions<Folder>): Promise<Folder | null>;
    createFolder(folder: Folder): Promise<Folder>;
    updateFolder(id: string, folder: Partial<Folder>): Promise<Folder | null>;
    deleteFolder(id: string): Promise<void>;
    findFolderById(id: string, ownerId?: string): Promise<Folder | null>;
    findUserFolders(userId: string, folderId: string, dto?: FindFolderDto): Promise<{
        data: Folder[];
        meta: {
            total: number;
            currentPage: number;
            totalPages: number;
        };
    }>;
    findAll(dto: FindFolderDto): Promise<{
        data: Folder[];
        total: number;
        currentPage: number;
        totalPages: number;
    }>;
    findSubFolders(parentId: string): Promise<Folder[]>;
    exists(name: string, userId: string): Promise<boolean>;
    renameFolder(id: string, newName: string): Promise<Folder>;
}
