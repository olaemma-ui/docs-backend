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
import { ShareRepository } from 'src/share/repository/share.repo-impl';
import { FileRepository } from 'src/files/repository/file.repo-impl';


@Injectable()
export class FoldersService {

  constructor(
    private readonly folderRepo: FolderRepository,
    private readonly fileRepo: FileRepository,
    private readonly shareRepo: ShareRepository,
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

  async findFolderByUser(userId: string, folderId: string): Promise<Folder> {
    // 1️⃣ Validate user existence
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('This user does not exist');

    // 2️⃣ Fetch folder with minimal relations
    const folder = await this.folderRepo.findOne({
      where: { id: folderId },
      relations: ['owner', 'parent'],
    });
    if (!folder) throw new NotFoundException('Folder not found');

    // 3️⃣ Verify user access (owner or shared)
    if (folder.owner?.id !== userId) {
      const hasAccess = await this.shareRepo.repo
        .createQueryBuilder('share')
        .leftJoin('share.sharedWithUsers', 'sharedUser')
        .leftJoin('share.sharedWithTeams', 'sharedTeam')
        .leftJoin('sharedTeam.members', 'teamMember')
        .leftJoin('teamMember.user', 'teamMemberUser')
        .where('share.folderId = :folderId', { folderId })
        .andWhere('(sharedUser.id = :userId OR teamMemberUser.id = :userId)', {
          userId,
        })
        .getExists();

      if (!hasAccess)
        throw new ForbiddenException('You do not have access to this folder');
    }

    // 4️⃣ Get all shares for this folder (but only minimal relations)
    const shares = await this.shareRepo.repo
      .createQueryBuilder('share')
      .leftJoinAndSelect('share.sharedBy', 'sharedBy')
      .leftJoinAndSelect('share.sharedWithUsers', 'sharedWithUsers')
      .leftJoinAndSelect('share.sharedWithTeams', 'sharedWithTeams')
      .leftJoinAndSelect('sharedWithTeams.members', 'teamMembers')
      .leftJoinAndSelect('teamMembers.user', 'teamMemberUser')
      .where('share.folderId = :folderId', { folderId })
      .orderBy('share.sharedAt', 'ASC')
      .select([
        'share.id',
        'share.access',
        'share.sharedAt',
        'sharedBy.id',
        'sharedBy.email',
        'sharedBy.fullName',
        'sharedWithUsers.id',
        'sharedWithUsers.email',
        'sharedWithUsers.fullName',
        'sharedWithTeams.id',
        'sharedWithTeams.name',
        'teamMemberUser.id',
        'teamMemberUser.email',
        'teamMemberUser.fullName',
      ])
      .getMany();

    // 5️⃣ Attach shares and file count
    folder.shares = shares;

    const filesCount = await this.fileRepo.repo.count({
      where: { folder: { id: folderId } },
    });
    folder['filesCount'] = filesCount;

    return folder;
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
