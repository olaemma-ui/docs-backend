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
import { FolderShareRepository } from './repository/folder-share.repo-impl';
import { PermissionService } from './permission.service';
import { CreateFolderShareDto } from './dto/create-folder-share.dto';
import { UpdateFolderShareDto } from './dto/update-folder-share.dto';
import { FolderShareResponseDto } from './dto/folder-share-response.dto';
import { FolderShare } from './entities/folder-share.entity';

@Injectable()
export class FoldersService {

  constructor(
    // @InjectRepository(Folder)
    private readonly folderRepo: FolderRepository,

    // @InjectRepository(User)
    private readonly userRepo: UserRepository,

    private readonly folderShareRepo: FolderShareRepository,
    private readonly permissionService: PermissionService,
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
    if (!folderNameExist) throw new ConflictException('This folder name already exist');

    const userExist = await this.userRepo.findById(userId);
    if (!userExist) throw new NotFoundException('This user does not exist');

    const folder = await this.folderRepo.renameFolder(dto.folderId, dto.name!);

    return folder;
  }

  async createShare(folderId: string, dto: CreateFolderShareDto, userId: string): Promise<FolderShareResponseDto> {
    const folder = await this.folderRepo.findFolderById(folderId);
    if (!folder) throw new NotFoundException('Folder not found');
    const hasPerm = await this.permissionService.hasPermission(userId, folderId, 'FULL');
    if (!hasPerm) throw new ForbiddenException('Insufficient permission');
    // TODO: Validate grantee existence (user/team)
    const share = await this.folderShareRepo.createShare({
      folder,
      granteeType: dto.granteeType,
      granteeId: dto.granteeId,
      permission: dto.permission,
      sharedBy: { id: userId } as any,
    });
    return {
      id: share.id!,
      folderId,
      granteeType: share.granteeType,
      granteeId: share.granteeId,
      permission: share.permission,
      sharedById: userId,
      createdAt: share.createdAt!,
    };
  }

  async listShares(folderId: string, userId: string): Promise<FolderShareResponseDto[]> {
    
    const folder = await this.folderRepo.findFolderById(folderId);
    if (!folder) throw new NotFoundException('Folder not found');
    
    const hasPerm = await this.permissionService.hasPermission(userId, folderId, 'VIEWER');
    if (!hasPerm) throw new ForbiddenException('Insufficient permission');
    
    const shares = await this.folderShareRepo.findSharesByFolder(folderId);
    return shares.map(s => ({
      id: s.id!,
      folderId,
      granteeType: s.granteeType,
      granteeId: s.granteeId,
      permission: s.permission,
      sharedById: s.sharedBy.id!,
      createdAt: s.createdAt!,
    }));
  }

  async updateShare(folderId: string, shareId: string, dto: UpdateFolderShareDto, userId: string): Promise<FolderShareResponseDto> {
    const folder = await this.folderRepo.findFolderById(folderId);
    if (!folder) throw new NotFoundException('Folder not found');
    const hasPerm = await this.permissionService.hasPermission(userId, folderId, 'FULL');
    if (!hasPerm) throw new ForbiddenException('Insufficient permission');
    const share = await this.folderShareRepo.findById(shareId);
    if (!share || share.folder.id !== folderId) throw new NotFoundException('Share not found');
    if (dto.permission) share.permission = dto.permission;
    if (dto.granteeId) share.granteeId = dto.granteeId;
    const updated = await this.folderShareRepo.updateShare(share);
    return {
      id: updated.id!,
      folderId,
      granteeType: updated.granteeType,
      granteeId: updated.granteeId,
      permission: updated.permission,
      sharedById: updated.sharedBy.id!,
      createdAt: updated.createdAt!,
    };
  }

  async revokeShare(folderId: string, shareId: string, userId: string): Promise<string> {
    const folder = await this.folderRepo.findFolderById(folderId);
    if (!folder) throw new NotFoundException('Folder not found');
    const hasPerm = await this.permissionService.hasPermission(userId, folderId, 'FULL');
    if (!hasPerm) throw new ForbiddenException('Insufficient permission');
    const share = await this.folderShareRepo.findById(shareId);
    if (!share || share.folder.id !== folderId) throw new NotFoundException('Share not found');
    await this.folderShareRepo.deleteShare(shareId);
    return shareId;
  }
}
