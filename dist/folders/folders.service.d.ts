import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { FolderRepository } from './repository/folder.repo-impl';
import { Folder } from './entities/folder.entity';
import { UserRepository } from 'src/user/repository/user-repo-impl';
import { FindFolderDto } from './dto/find-folder.dto';
export declare class FoldersService {
    private readonly folderRepo;
    private readonly userRepo;
    constructor(folderRepo: FolderRepository, userRepo: UserRepository);
    create(createFolderDto: CreateFolderDto, userId: string): Promise<Folder>;
    findUserFolders(userId: string, dto: FindFolderDto): Promise<{
        data: Folder[];
        meta: {
            total: number;
            currentPage: number;
            totalPages: number;
        };
    }>;
    findAllFolder(userId: string, dto: FindFolderDto): Promise<{
        data: Folder[];
        total: number;
        currentPage: number;
        totalPages: number;
    }>;
    renameFolder(dto: UpdateFolderDto, userId: string, folderId: string): Promise<Folder>;
}
