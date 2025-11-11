import { Folder } from "../entities/folder.entity";
import { User } from "src/user/entities/user.entity";
import { Team } from "src/team/entities/team.entity";
import { FindFolderDto } from "../dto/find-folder.dto";

export interface IFolderRepository {
    /**
     * Create a new folder
     */
    createFolder(folder: Folder): Promise<Folder>;

    /**
     * Update an existing folder
     */
    updateFolder(id: string, folder: Partial<Folder>): Promise<Folder | null>;

    /**
     * Delete a folder by ID
     */
    deleteFolder(id: string): Promise<void>;

    /**
     * Find a folder by its ID
     */
    findFolderById(id: string, ownerId?: string): Promise<Folder | null>;
    /**
     * Get all folders owned by a specific user
     */
    findUserFolders(userId: string, folderId: string, dto?: FindFolderDto): Promise<{
        data: Folder[];
        meta: {
            total: number;
            currentPage: number;
            totalPages: number;
        }
    }>

    /**
     * Get all folders belonging to a specific team
     */
    // findTeamFolders(team: Team): Promise<Folder[]>;

    /**
     * Get all subfolders under a parent folder
     */
    // findSubFolders(parentId: string): Promise<Folder[]>;

    /**
     * Check if a folder exists by ID
     */
    exists(name: string, userId: string): Promise<boolean>;

    /**
     * Move a folder to a new parent folder
     */
    // moveFolder(id: string, newParentId: string | null): Promise<Folder>;

    /**
     * Rename a folder
     */
    renameFolder(id: string, newName: string): Promise<Folder>;

    /**
     * Get all root-level folders (no parent)
     * for a user or team
     */
    // findRootFolders(ownerId: string, isTeam?: boolean): Promise<Folder[]>;
}
