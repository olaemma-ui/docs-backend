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
exports.ShareService = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("../notification/notification.service");
const share_repo_impl_1 = require("./repository/share.repo-impl");
const file_repo_impl_1 = require("../files/repository/file.repo-impl");
const folder_repo_impl_1 = require("../folders/repository/folder.repo-impl");
const team_repo_impl_1 = require("../team/repository/team.repo-impl");
const user_repo_impl_1 = require("../user/repository/user-repo-impl");
const share_entity_1 = require("./entities/share.entity");
let ShareService = class ShareService {
    shareRepo;
    userRepo;
    teamRepo;
    fileRepo;
    folderRepo;
    notificationService;
    constructor(shareRepo, userRepo, teamRepo, fileRepo, folderRepo, notificationService) {
        this.shareRepo = shareRepo;
        this.userRepo = userRepo;
        this.teamRepo = teamRepo;
        this.fileRepo = fileRepo;
        this.folderRepo = folderRepo;
        this.notificationService = notificationService;
    }
    async share(sharedBy, dto) {
        const file = dto.fileId ? await this.fileRepo.findById(dto.fileId) : null;
        if (dto.fileId && !file)
            throw new common_1.NotFoundException('File not found');
        const folder = dto.folderId ? await this.folderRepo.findFolderById(dto.folderId) : null;
        if (dto.folderId && !folder)
            throw new common_1.NotFoundException('Folder not found');
        if (folder?.owner?.id !== sharedBy.id && file?.folder.owner !== sharedBy.id) {
            throw new common_1.ForbiddenException(`You don't have permission to share this ${file ? 'File' : 'Folder'}`);
        }
        let users = [];
        if (dto.emails?.length) {
            const foundUsers = await this.userRepo.findByEmails(dto.emails);
            if (!foundUsers.length)
                throw new common_1.NotFoundException('No users found for the provided IDs');
            users.push(...foundUsers);
        }
        let teams = [];
        if (dto.teamIds?.length) {
            const foundTeams = await this.teamRepo.findByIds(dto.teamIds);
            if (!foundTeams.length)
                throw new common_1.NotFoundException('No teams found for the provided IDs');
            teams.push(...foundTeams);
            for (const team of foundTeams) {
                users.push(...(team.members ?? []).map(m => m.user));
            }
        }
        users = Array.from(new Map(users.map(u => [u.id, u])).values());
        let share = await this.shareRepo.findOne({ file: file ?? undefined, folder: folder ?? undefined }, ['sharedWithUsers', 'sharedWithTeams']);
        if (share) {
            const existingUserIds = new Set(share.sharedWithUsers.map(u => u.id));
            share.sharedWithUsers.push(...users.filter(u => !existingUserIds.has(u.id)));
            const existingTeamIds = new Set(share.sharedWithTeams.map(t => t.id));
            share.sharedWithTeams.push(...teams.filter(t => !existingTeamIds.has(t.id)));
            share.access = dto.access;
            share.note = dto.note ?? share.note;
        }
        else {
            share = new share_entity_1.Share();
            share.sharedBy = sharedBy;
            share.sharedWithUsers = users;
            share.sharedWithTeams = teams;
            share.file = file ?? undefined;
            share.folder = folder ?? undefined;
            share.access = dto.access;
            share.note = dto.note;
        }
        const savedShare = await this.shareRepo.save([share]);
        for (const user of users) {
            if (file) {
                this.notificationService.sendFolderOrFileSharedMail(user.email, user.fullName, sharedBy.fullName, file.name, 'File', '');
            }
            else if (folder) {
                this.notificationService.sendFolderOrFileSharedMail(user.email, user.fullName, sharedBy.fullName, folder.name, 'Folder', '');
            }
        }
        return savedShare[0];
    }
    async revoke(sharedBy, dto) {
        const file = dto.fileId ? await this.fileRepo.findById(dto.fileId) : null;
        if (dto.fileId && !file)
            throw new common_1.NotFoundException('File not found');
        const folder = dto.folderId ? await this.folderRepo.findFolderById(dto.folderId) : null;
        if (dto.folderId && !folder)
            throw new common_1.NotFoundException('Folder not found');
        if (folder?.owner?.id !== sharedBy.id && file?.folder.owner !== sharedBy.id) {
            throw new common_1.ForbiddenException(`You don't have permission to revoke this ${file ? 'File' : 'Folder'}`);
        }
        const shares = await this.shareRepo.find({
            file: file ?? undefined,
            folder: folder ?? undefined
        });
        for (const share of shares) {
            if (dto.userIds?.length) {
                share.sharedWithUsers = share.sharedWithUsers.filter(u => !(dto.userIds ?? []).includes(u.id));
            }
            if (dto.teamIds?.length) {
                share.sharedWithTeams = share.sharedWithTeams.filter(t => !(dto.teamIds ?? []).includes(t.id));
            }
            if ((!share.sharedWithUsers?.length) && (!share.sharedWithTeams?.length)) {
                await this.shareRepo.delete(share);
            }
            else {
                await this.shareRepo.save([share]);
            }
        }
    }
    async getFileOrFolderShares(fileId, folderId) {
        const { file, folder } = await this.validateFileOrFolder(fileId, folderId);
        const shares = await this.fetchShares(file?.id, folder?.id);
        const { users, teams } = this.extractRecipients(shares);
        return { users: this.mapSafeUsers(users), teams };
    }
    async validateFileOrFolder(fileId, folderId) {
        let file = null;
        let folder = null;
        if (fileId) {
            file = await this.fileRepo.findById(fileId);
            if (!file)
                throw new common_1.NotFoundException('File not found');
        }
        if (folderId) {
            folder = await this.folderRepo.findFolderById(folderId);
            if (!folder)
                throw new common_1.NotFoundException('Folder not found');
        }
        return { file, folder };
    }
    async fetchShares(fileId, folderId) {
        return this.shareRepo.find({
            file: fileId ? { id: fileId } : undefined,
            folder: folderId ? { id: folderId } : undefined,
        });
    }
    extractRecipients(shares) {
        const teamsMap = new Map();
        const usersMap = new Map();
        for (const share of shares) {
            for (const team of share.sharedWithTeams ?? []) {
                teamsMap.set(team.id, team);
            }
        }
        const teamUserIds = new Set();
        for (const team of teamsMap.values()) {
            for (const member of team.members ?? []) {
                if (member.user?.id)
                    teamUserIds.add(member.user.id);
            }
        }
        for (const share of shares) {
            for (const user of share.sharedWithUsers ?? []) {
                if (!teamUserIds.has(user.id)) {
                    usersMap.set(user.id, user);
                }
            }
        }
        return {
            users: Array.from(usersMap.values()),
            teams: Array.from(teamsMap.values()),
        };
    }
    mapSafeUsers(users) {
        return users.map(u => ({
            id: u.id,
            email: u.email,
            fullName: u.fullName,
            status: u.status,
            role: u.role,
            createdAt: u.createdAt,
        }));
    }
};
exports.ShareService = ShareService;
exports.ShareService = ShareService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [share_repo_impl_1.ShareRepository,
        user_repo_impl_1.UserRepository,
        team_repo_impl_1.TeamRepository,
        file_repo_impl_1.FileRepository,
        folder_repo_impl_1.FolderRepository,
        notification_service_1.NotificationService])
], ShareService);
//# sourceMappingURL=share.service.js.map