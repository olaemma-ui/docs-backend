import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike } from "typeorm";
import { FileEntity } from "../entities/file.entity";
import { Folder } from "src/folders/entities/folder.entity";
import { User } from "src/user/entities/user.entity";
import { IFileRepository } from "./file.repo";

@Injectable()
export class FileRepository implements IFileRepository {
    constructor(
        @InjectRepository(FileEntity)
        private readonly repo: Repository<FileEntity>,
    ) { }

    async createFile(file: FileEntity): Promise<FileEntity> {
        let f = await this.repo.create(file)
        return await this.repo.save(f);
    }

    async updateFile(id: string, partial: Partial<FileEntity>): Promise<FileEntity | null> {
        await this.repo.update(id, partial);
        return await this.findById(id);
    }

    async deleteFile(id: string): Promise<void> {
        await this.repo.delete(id);
    }

    async findById(id: string): Promise<FileEntity | null> {
        return await this.repo.findOne({ where: { id }, relations: ["folder", "uploader"] });
    }

    async findByFolder(
        folder: Folder,
        page = 1,
        limit = 10,
    ): Promise<{ data: FileEntity[]; total: number; page: number; limit: number }> {
        const [data, total] = await this.repo.findAndCount({
            where: { folder: { id: folder.id } },
            relations: ["folder", "uploader"],
            order: { createdAt: "DESC" },
            skip: (page - 1) * limit,
            take: limit,
        });

        return { data, total, page, limit };
    }

    async findByUploader(
        uploader: User,
        page = 1,
        limit = 10,
    ): Promise<{ data: FileEntity[]; total: number; page: number; limit: number }> {
        const [data, total] = await this.repo.findAndCount({
            where: { uploader: { id: uploader.id } },
            relations: ["folder", "uploader"],
            order: { createdAt: "DESC" },
            skip: (page - 1) * limit,
            take: limit,
        });

        return { data, total, page, limit };
    }

    async findByFolderAndUploader(
        folderId: string,
        uploaderId?: string,
        pageNumber = 1,
        limit = 10,
        filters?: { mimeType?: string; keyWord?: string; dateFrom?: Date; dateTo?: Date; minSize?: number; maxSize?: number },
        sort?: { sortBy?: 'createdAt' | 'name' | 'size'; sortOrder?: 'ASC' | 'DESC' },
    ): Promise<{
        data: FileEntity[];
        meta: {
            total: number;
            currentPage: number;
            totalPages: number;
        }
    }> {
        const qb = this.repo.createQueryBuilder('file')
            .leftJoin('file.folder', 'folder')
            .leftJoin('file.uploader', 'uploader')
            .addSelect(['uploader.id', 'uploader.fullName', 'uploader.email'])
            .where('folder.id = :folderId', { folderId });

        if (uploaderId) qb.andWhere('uploader.id = :uploaderId', { uploaderId });

        if (filters) {
            if (filters.keyWord) {
                qb.andWhere('file.name ILIKE :keyWord', { keyWord: `%${filters.keyWord}%` });
            }
            if (filters.mimeType) qb.andWhere('file.mimeType = :mimeType', { mimeType: filters.mimeType });
            if (filters.minSize) qb.andWhere('file.size >= :minSize', { minSize: filters.minSize });
            if (filters.maxSize) qb.andWhere('file.size <= :maxSize', { maxSize: filters.maxSize });
            if (filters.dateFrom) qb.andWhere('file.createdAt >= :dateFrom', { dateFrom: filters.dateFrom });
            if (filters.dateTo) qb.andWhere('file.createdAt <= :dateTo', { dateTo: filters.dateTo });
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

    async search(
        query: string,
        page = 1,
        limit = 10,
    ): Promise<{ data: FileEntity[]; total: number; page: number; limit: number }> {
        const [data, total] = await this.repo.findAndCount({
            where: [
                { name: ILike(`%${query}%`) },
                { mimeType: ILike(`%${query}%`) },
            ],
            order: { createdAt: "DESC" },
            relations: ["folder", "uploader"],
            skip: (page - 1) * limit,
            take: limit,
        });

        return { data, total, page, limit };
    }

    async exists(id: string): Promise<boolean> {
        const count = await this.repo.count({ where: { id } });
        return count > 0;
    }
}
