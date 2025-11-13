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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const share_entity_1 = require("../entities/share.entity");
const share_repo_1 = require("./share.repo");
let ShareRepository = class ShareRepository extends share_repo_1.IShareRepository {
    shareRepo;
    constructor(shareRepo) {
        super();
        this.shareRepo = shareRepo;
    }
    async save(shares) {
        return this.shareRepo.save(shares, { reload: true });
    }
    async deleteByIds(ids) {
        if (!ids?.length)
            return;
        await this.shareRepo.delete(ids);
    }
    async delete(share) {
        await this.shareRepo.remove(share);
    }
    async find(filter) {
        return this.shareRepo.find({
            where: filter,
            relations: ['sharedWithUsers', 'sharedWithTeams', 'file', 'folder', 'sharedBy']
        });
    }
    async findOne(filter) {
        return this.shareRepo.findOne({
            where: filter,
            relations: ['sharedWithUsers', 'sharedWithTeams', 'file', 'folder', 'sharedBy']
        });
    }
    async findUserShare(fileId, folderId, userId) {
        if (!userId)
            return null;
        if (!fileId && !folderId)
            return null;
        const qb = this.shareRepo
            .createQueryBuilder('share')
            .leftJoinAndSelect('share.sharedWithUsers', 'sharedUser')
            .leftJoinAndSelect('share.sharedWithTeams', 'sharedTeam')
            .leftJoinAndSelect('sharedTeam.members', 'teamMember')
            .leftJoinAndSelect('teamMember.user', 'teamMemberUser')
            .leftJoinAndSelect('share.folder', 'folder')
            .leftJoinAndSelect('share.file', 'file')
            .leftJoin('folder.owner', 'folderOwner')
            .leftJoin('file.uploader', 'fileOwner');
        qb.andWhere(new typeorm_2.Brackets((qbWhere) => {
            if (folderId)
                qbWhere.orWhere('folder.id = :folderId', { folderId });
            if (fileId)
                qbWhere.orWhere('file.id = :fileId', { fileId });
        }));
        qb.andWhere(new typeorm_2.Brackets((qbUser) => {
            qbUser
                .where('sharedUser.id = :userId', { userId })
                .orWhere('teamMemberUser.id = :userId', { userId })
                .orWhere('folderOwner.id = :userId', { userId })
                .orWhere('fileOwner.id = :userId', { userId });
        }));
        return qb.getOne();
    }
};
exports.ShareRepository = ShareRepository;
exports.ShareRepository = ShareRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(share_entity_1.Share)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ShareRepository);
//# sourceMappingURL=share.repo-impl.js.map