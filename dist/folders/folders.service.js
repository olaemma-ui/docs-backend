"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoldersService = void 0;
const common_1 = require("@nestjs/common");
const folder_repo_impl_1 = require("./repository/folder.repo-impl");
const user_repo_impl_1 = require("../user/repository/user-repo-impl");
const user_enums_1 = require("../user/user.enums");
const share_repo_impl_1 = require("../share/repository/share.repo-impl");
const file_repo_impl_1 = require("../files/repository/file.repo-impl");
let FoldersService = class FoldersService {
    folderRepo;
    fileRepo;
    shareRepo;
    userRepo;
    constructor(folderRepo, fileRepo, shareRepo, userRepo) {
        this.folderRepo = folderRepo;
        this.fileRepo = fileRepo;
        this.shareRepo = shareRepo;
        this.userRepo = userRepo;
    }
    async create(createFolderDto, userId) {
        let parentFolder = null;
        const folderExist = await this.folderRepo.exists(createFolderDto.name, userId);
        if (folderExist)
            throw new common_1.ConflictException('Thi s folder name already exist');
        const userExist = await this.userRepo.findById(userId);
        if (!userExist)
            throw new common_1.NotFoundException('This user does not exist');
        if (createFolderDto.parentId) {
            parentFolder = await this.folderRepo.findFolderById(createFolderDto.parentId);
            if (!parentFolder)
                throw new common_1.NotFoundException('The parent folder does not exist!');
        }
        let folder = {
            name: createFolderDto.name,
            owner: userExist,
            parent: (parentFolder ?? undefined),
        };
        const savedFolder = await this.folderRepo.createFolder(folder);
        savedFolder.owner = undefined;
        return savedFolder;
    }
    async findUserFolders(userId, dto) {
        const userExist = await this.userRepo.findById(userId);
        if (!userExist)
            throw new common_1.NotFoundException('This user does not exist');
        const folders = await this.folderRepo.findUserFolders(userId, '', dto);
        return folders;
    }
    async findFolderByUser(userId, folderId) {
        const user = await this.userRepo.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('This user does not exist');
        const folder = await this.folderRepo.findOne({
            where: { id: folderId },
            relations: ['owner', 'parent'],
        });
        if (!folder)
            throw new common_1.NotFoundException('Folder not found');
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
                throw new common_1.ForbiddenException('You do not have access to this folder');
        }
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
        folder.shares = shares;
        const filesCount = await this.fileRepo.repo.count({
            where: { folder: { id: folderId } },
        });
        folder['filesCount'] = filesCount;
        return folder;
    }
    async findAllFolder(userId, dto) {
        const userExist = await this.userRepo.findById(userId);
        if (!userExist)
            throw new common_1.NotFoundException('This user does not exist');
        if (userExist.role != user_enums_1.UserRoles.SUPER_ADMIN)
            throw new common_1.UnauthorizedException('Unauthorized access to resource!!');
        const folders = await this.folderRepo.findAll(dto);
        return folders;
    }
    async renameFolder(dto, userId, folderId) {
        const folderExist = await this.folderRepo.findFolderById(folderId);
        if (!folderExist)
            throw new common_1.ConflictException('This folder does not exist');
        if (folderExist.owner?.id !== userId)
            throw new common_1.ForbiddenException('You do not have the permission to rename this folder!');
        const folderNameExist = await this.folderRepo.exists(dto.name, userId);
        if (folderNameExist)
            throw new common_1.ConflictException('This folder name already exist');
        const userExist = await this.userRepo.findById(userId);
        if (!userExist)
            throw new common_1.NotFoundException('This user does not exist');
        const folder = await this.folderRepo.renameFolder(folderId, dto.name);
        return folder;
    }
};
exports.FoldersService = FoldersService;
exports.FoldersService = FoldersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [folder_repo_impl_1.FolderRepository,
        file_repo_impl_1.FileRepository,
        share_repo_impl_1.ShareRepository,
        user_repo_impl_1.UserRepository])
], FoldersService);
//# sourceMappingURL=folders.service.js.map