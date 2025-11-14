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
exports.FolderRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const folder_entity_1 = require("../entities/folder.entity");
let FolderRepository = class FolderRepository {
    folderRepo;
    constructor(folderRepo) {
        this.folderRepo = folderRepo;
    }
    async findOne(options) {
        return await this.folderRepo.findOne(options);
    }
    async createFolder(folder) {
        const f = await this.folderRepo.create(folder);
        return await this.folderRepo.save(f);
    }
    async updateFolder(id, folder) {
        await this.folderRepo.update(id, folder);
        return await this.findFolderById(id);
    }
    async deleteFolder(id) {
        await this.folderRepo.delete(id);
    }
    async findFolderById(id, ownerId) {
        const qb = this.folderRepo.createQueryBuilder('folder')
            .leftJoinAndSelect('folder.owner', 'owner')
            .leftJoinAndSelect('folder.parent', 'parent')
            .where('folder.id = :id', { id });
        if (ownerId) {
            qb.andWhere('owner.id = :ownerId', { ownerId });
        }
        return await qb.getOne();
    }
    async findUserFolders(userId, folderId, dto) {
        const skip = ((dto?.pageNumber ?? 1) - 1) * (dto?.pageSize ?? 10);
        const query = this.folderRepo
            .createQueryBuilder('folder')
            .leftJoin('folder.owner', 'owner')
            .addSelect(['owner.id', 'owner.email', 'owner.fullName'])
            .leftJoin('folder.parent', 'parent')
            .leftJoin('folder.shares', 'share')
            .leftJoin('share.sharedWithUsers', 'sharedUser')
            .leftJoin('share.sharedWithTeams', 'sharedTeam')
            .leftJoin('sharedTeam.members', 'teamMember')
            .leftJoin('teamMember.user', 'teamMemberUser')
            .loadRelationCountAndMap('folder.filesCount', 'folder.files')
            .where('owner.id = :userId', { userId })
            .orWhere('sharedUser.id = :userId', { userId })
            .orWhere('teamMemberUser.id = :userId', { userId });
        if (folderId.length > 0) {
            query.andWhere('folder.id =:folderId', { folderId });
        }
        if (dto?.search && dto?.search.trim() !== '') {
            query.andWhere('LOWER(folder.name) LIKE LOWER(:search)', {
                search: `%${dto?.search}%`,
            });
        }
        query.orderBy(`folder.${dto?.sortBy ?? 'createdAt'}`, dto?.sortOrder ?? 'ASC');
        query.skip(skip).take(dto?.pageSize);
        const [data, total] = await query.getManyAndCount();
        return {
            data,
            meta: {
                total,
                currentPage: (dto?.pageNumber ?? 1),
                totalPages: Math.ceil(total / (dto?.pageSize ?? 10)),
            }
        };
    }
    async findAll(dto) {
        const skip = ((dto.pageNumber ?? 1) - 1) * (dto.pageSize ?? 10);
        const query = this.folderRepo.createQueryBuilder('folder');
        if (dto.search && dto.search.trim() !== '') {
            query.andWhere('LOWER(folder.name) LIKE LOWER(:search)', {
                search: `%${dto.search}%`,
            });
        }
        query.orderBy(`folder.${dto.sortBy}`, dto.sortOrder);
        query.skip(skip).take(dto.pageSize);
        const [data, total] = await query.getManyAndCount();
        return {
            data,
            total,
            currentPage: (dto.pageNumber ?? 1),
            totalPages: Math.ceil(total / (dto.pageSize ?? 10)),
        };
    }
    async findSubFolders(parentId) {
        return await this.folderRepo.find({
            where: { parent: { id: parentId } },
            relations: ["owner"],
        });
    }
    async exists(name, userId) {
        const count = await this.folderRepo.count({
            where: { name, owner: { id: userId } }
        });
        return count > 0;
    }
    async renameFolder(id, newName) {
        const folder = await this.findFolderById(id);
        if (!folder)
            throw new Error("Folder not found");
        folder.name = newName;
        return await this.folderRepo.save(folder);
    }
};
exports.FolderRepository = FolderRepository;
exports.FolderRepository = FolderRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(folder_entity_1.Folder)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FolderRepository);
//# sourceMappingURL=folder.repo-impl.js.map