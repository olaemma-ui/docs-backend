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
exports.FileRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const file_entity_1 = require("../entities/file.entity");
let FileRepository = class FileRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async createFile(file) {
        let f = await this.repo.create(file);
        return await this.repo.save(f);
    }
    async updateFile(id, partial) {
        await this.repo.update(id, partial);
        return await this.findById(id);
    }
    async deleteFile(id) {
        await this.repo.delete(id);
    }
    async findById(id) {
        return await this.repo.findOne({ where: { id }, relations: ["folder", "uploader"] });
    }
    async findByFolder(folder, page = 1, limit = 10) {
        const [data, total] = await this.repo.findAndCount({
            where: { folder: { id: folder.id } },
            relations: ["folder", "uploader"],
            order: { createdAt: "DESC" },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit };
    }
    async findByUploader(uploader, page = 1, limit = 10) {
        const [data, total] = await this.repo.findAndCount({
            where: { uploader: { id: uploader.id } },
            relations: ["folder", "uploader"],
            order: { createdAt: "DESC" },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit };
    }
    async findByFolderAndUploader(folderId, uploaderId, pageNumber = 1, limit = 10, filters, sort) {
        const qb = this.repo.createQueryBuilder('file')
            .leftJoin('file.folder', 'folder')
            .leftJoin('file.uploader', 'uploader')
            .addSelect(['uploader.id', 'uploader.fullName', 'uploader.email'])
            .where('folder.id = :folderId', { folderId });
        if (uploaderId)
            qb.andWhere('uploader.id = :uploaderId', { uploaderId });
        if (filters) {
            if (filters.keyWord) {
                qb.andWhere('file.name ILIKE :keyWord', { keyWord: `%${filters.keyWord}%` });
            }
            if (filters.mimeType)
                qb.andWhere('file.mimeType = :mimeType', { mimeType: filters.mimeType });
            if (filters.minSize)
                qb.andWhere('file.size >= :minSize', { minSize: filters.minSize });
            if (filters.maxSize)
                qb.andWhere('file.size <= :maxSize', { maxSize: filters.maxSize });
            if (filters.dateFrom)
                qb.andWhere('file.createdAt >= :dateFrom', { dateFrom: filters.dateFrom });
            if (filters.dateTo)
                qb.andWhere('file.createdAt <= :dateTo', { dateTo: filters.dateTo });
        }
        const orderBy = `file.${(sort?.sortBy) ?? 'createdAt'}`;
        qb.orderBy(orderBy, sort?.sortOrder ?? 'DESC');
        qb.skip((pageNumber - 1) * limit).take(limit);
        const [data, total] = await qb.getManyAndCount();
        return {
            data,
            meta: {
                total,
                currentPage: pageNumber,
                totalPages: Math.ceil(total / (limit)),
            }
        };
    }
    async search(query, page = 1, limit = 10) {
        const [data, total] = await this.repo.findAndCount({
            where: [
                { name: (0, typeorm_2.ILike)(`%${query}%`) },
                { mimeType: (0, typeorm_2.ILike)(`%${query}%`) },
            ],
            order: { createdAt: "DESC" },
            relations: ["folder", "uploader"],
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit };
    }
    async exists(id) {
        const count = await this.repo.count({ where: { id } });
        return count > 0;
    }
};
exports.FileRepository = FileRepository;
exports.FileRepository = FileRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(file_entity_1.FileEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FileRepository);
//# sourceMappingURL=file.repo-impl.js.map