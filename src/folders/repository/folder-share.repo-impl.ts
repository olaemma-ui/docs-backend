import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FolderShare, GranteeType, SharePermission } from '../entities/folder-share.entity';

@Injectable()
export class FolderShareRepository {
    constructor(
        @InjectRepository(FolderShare)
        private readonly repo: Repository<FolderShare>,
    ) { }

    async createShare(share: FolderShare): Promise<FolderShare> {
        const s = this.repo.create(share);
        return this.repo.save(s);
    }

    async findSharesByFolder(folderId: string): Promise<FolderShare[]> {
        return this.repo.find({ where: { folder: { id: folderId } }, relations: ['sharedBy'] });
    }

    async findUserShare(folderId: string, userId: string): Promise<FolderShare | null> {
        return this.repo.findOne({ where: { folder: { id: folderId }, granteeType: GranteeType.USER, granteeId: userId } });
    }

    async deleteShare(id: string): Promise<void> {
        await this.repo.delete(id);
    }

    async findById(id: string): Promise<FolderShare | null> {
        return this.repo.findOne({ where: { id }, relations: ['sharedBy', 'folder'] });
    }

    async updateShare(share: FolderShare): Promise<FolderShare> {
        return this.repo.save(share);
    }
}
