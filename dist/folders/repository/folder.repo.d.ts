import { Folder } from "../entities/folder.entity";
import { FindFolderDto } from "../dto/find-folder.dto";
export interface IFolderRepository {
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
    exists(name: string, userId: string): Promise<boolean>;
    renameFolder(id: string, newName: string): Promise<Folder>;
}
