import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { FindFolderDto } from './dto/find-folder.dto';
import { BaseResponse } from 'src/common/dto/base-response.dto';
import { Folder } from './entities/folder.entity';
import { User as UserEntity } from 'src/user/entities/user.entity';
export declare class FoldersController {
    private readonly foldersService;
    constructor(foldersService: FoldersService);
    create(createFolderDto: CreateFolderDto, request: Record<string, any>): Promise<BaseResponse<Folder>>;
    findAll(dto: FindFolderDto, user: UserEntity): Promise<BaseResponse<{
        data: Folder[];
        total: number;
        currentPage: number;
        totalPages: number;
    }>>;
    findUserFolders(dto: FindFolderDto, user: UserEntity): Promise<BaseResponse<Folder[]>>;
    renameFolder(dto: UpdateFolderDto, user: UserEntity, folderId: string): Promise<BaseResponse<Folder>>;
    getFolderDetails(folderId: string, user: UserEntity): Promise<BaseResponse<Folder>>;
    deleteFolder(id: string, request: Record<string, any>, user: UserEntity): Promise<BaseResponse<string>>;
}
