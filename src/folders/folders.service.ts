import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { FolderRepository } from './repository/folder.repo-impl';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Folder } from './entities/folder.entity';
import { UserRepository } from 'src/user/repository/user-repo-impl';
import { AccountStatus, UserRoles } from 'src/user/user.enums';
import { FindFolderDto } from './dto/find-folder.dto';


@Injectable()
export class FoldersService {

  constructor(
    private readonly folderRepo: FolderRepository,
    private readonly userRepo: UserRepository,

  ) { }


  async create(createFolderDto: CreateFolderDto, userId: string): Promise<Folder> {

    let parentFolder: Folder | null = null;

    const folderExist = await this.folderRepo.exists(createFolderDto.name, userId);
    if (folderExist) throw new ConflictException('Thi s folder name already exist');

    const userExist = await this.userRepo.findById(userId);
    if (!userExist) throw new NotFoundException('This user does not exist');

    if (createFolderDto.parentId) {
      parentFolder = await this.folderRepo.findFolderById(createFolderDto.parentId);
      if (!parentFolder) throw new NotFoundException('The parent folder does not exist!')
    }


    let folder: Folder = {
      name: createFolderDto.name,
      owner: userExist,
      parent: (parentFolder ?? undefined),

    }

    const savedFolder = await this.folderRepo.createFolder(folder);
    savedFolder.owner = undefined;

    return savedFolder;
  }


  async findUserFolders(userId: string, dto: FindFolderDto): Promise<{
    data: Folder[];
    meta: {
      total: number;
      currentPage: number;
      totalPages: number;
    }
  }> {

    const userExist = await this.userRepo.findById(userId);
    if (!userExist) throw new NotFoundException('This user does not exist');

    const folders = await this.folderRepo.findUserFolders(userId, '', dto);

    return folders;
  }

  async findAllFolder(userId: string, dto: FindFolderDto): Promise<{
    data: Folder[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {

    const userExist = await this.userRepo.findById(userId);
    if (!userExist) throw new NotFoundException('This user does not exist');
    if (userExist.role != UserRoles.SUPER_ADMIN) throw new UnauthorizedException('Unauthorized access to resource!!')

    const folders = await this.folderRepo.findAll(dto);

    return folders;
  }


  async renameFolder(dto: UpdateFolderDto, userId: string, folderId: string): Promise<Folder> {

    const folderExist = await this.folderRepo.findFolderById(folderId);
    if (!folderExist) throw new ConflictException('This folder does not exist');
    if (folderExist.owner?.id !== userId) throw new ForbiddenException('You do not have the permission to rename this folder!')

    const folderNameExist = await this.folderRepo.exists(dto.name!, userId);
    if (folderNameExist) throw new ConflictException('This folder name already exist');

    const userExist = await this.userRepo.findById(userId);
    if (!userExist) throw new NotFoundException('This user does not exist');

    const folder = await this.folderRepo.renameFolder(folderId, dto.name!);

    return folder;
  }
}
