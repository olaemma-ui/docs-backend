import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindOptionsWhere, Brackets } from 'typeorm';
import { Share } from '../entities/share.entity';
import { IShareRepository } from './share.repo';

@Injectable()
export class ShareRepository extends IShareRepository {

    constructor(
        @InjectRepository(Share)
        readonly repo: Repository<Share>,
    ) { super(); }

    /**
     * Save multiple Share entities
     */
    async save(shares: Share[]): Promise<Share[]> {
        return this.repo.save(shares, { reload: true });
    }

    /**
     * Delete multiple shares by their IDs
     */
    async deleteByIds(ids: string[]): Promise<void> {
        if (!ids?.length) return;
        await this.repo.delete(ids);
    }

    /**
     * Delete a single share entity
     */
    async delete(share: Share): Promise<void> {
        await this.repo.remove(share);
    }

    /**
     * Find shares matching a filter
     */
    async find(filter: FindOptionsWhere<Share>): Promise<Share[]> {
        return this.repo.find({
            where: filter,
            relations: ['sharedWithUsers', 'sharedWithTeams', 'file', 'folder', 'sharedBy']
        });
    }

    /**
     * Find a single share matching a filter
     */
    async findOne(filter: FindOptionsWhere<Share>, relations?: string[]): Promise<Share | null> {
        return this.repo.findOne({
            where: filter,
            relations: relations ?? ['sharedWithUsers', 'sharedWithTeams', 'file', 'folder', 'sharedBy']
        });
    }


    /**
    * Find if a specific user has access to a shared folder (directly or via a team)
    */
    async findUserShare(
        fileId?: string,
        folderId?: string,
        userId?: string
    ): Promise<Share | null> {
        // If no userId provided there's nothing to check
        if (!userId) return null;

        // If neither fileId nor folderId provided, nothing to search for
        if (!fileId && !folderId) return null;

        const qb = this.repo
            .createQueryBuilder('share')
            .leftJoinAndSelect('share.sharedWithUsers', 'sharedUser')
            .leftJoinAndSelect('share.sharedWithTeams', 'sharedTeam')
            .leftJoinAndSelect('sharedTeam.members', 'teamMember')
            .leftJoinAndSelect('teamMember.user', 'teamMemberUser')
            .leftJoinAndSelect('share.folder', 'folder')
            .leftJoinAndSelect('share.file', 'file')
            // join owners so we can check ownership (folder owner / file uploader)
            .leftJoin('folder.owner', 'folderOwner')
            .leftJoin('file.uploader', 'fileOwner');

        // file/folder match (only include conditions that exist)
        qb.andWhere(
            new Brackets((qbWhere) => {
                if (folderId) qbWhere.orWhere('folder.id = :folderId', { folderId });
                if (fileId) qbWhere.orWhere('file.id = :fileId', { fileId });
            })
        );

        // user access check: direct share, team membership, folder owner or file uploader
        qb.andWhere(
            new Brackets((qbUser) => {
                qbUser
                    .where('sharedUser.id = :userId', { userId })
                    .orWhere('teamMemberUser.id = :userId', { userId })
                    .orWhere('folderOwner.id = :userId', { userId })
                    .orWhere('fileOwner.id = :userId', { userId });
            })
        );

        return qb.getOne();
    }
}
