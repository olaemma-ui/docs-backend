import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { FolderRepository } from './repository/folder.repo-impl';
import { Folder } from './entities/folder.entity';
import { UserRepository } from 'src/user/repository/user-repo-impl';
import { FindFolderDto } from './dto/find-folder.dto';
import { ShareRepository } from 'src/share/repository/share.repo-impl';
import { FileRepository } from 'src/files/repository/file.repo-impl';
export declare class FoldersService {
    private readonly folderRepo;
    private readonly fileRepo;
    private readonly shareRepo;
    private readonly userRepo;
    constructor(folderRepo: FolderRepository, fileRepo: FileRepository, shareRepo: ShareRepository, userRepo: UserRepository);
    create(createFolderDto: CreateFolderDto, userId: string): Promise<Folder>;
    findUserFolders(userId: string, dto: FindFolderDto): Promise<{
        data: Folder[];
        meta: {
            total: number;
            currentPage: number;
            totalPages: number;
        };
    }>;
    findFolderByUser(userId: string, folderId: string): Promise<Folder>;
    findAllFolder(userId: string, dto: FindFolderDto): Promise<{
        data: Folder[];
        total: number;
        currentPage: number;
        totalPages: number;
    }>;
    renameFolder(dto: UpdateFolderDto, userId: string, folderId: string): Promise<Folder>;
}
