import { Repository, FindOptionsWhere } from 'typeorm';
import { Share } from '../entities/share.entity';
import { IShareRepository } from './share.repo';
export declare class ShareRepository extends IShareRepository {
    private readonly shareRepo;
    constructor(shareRepo: Repository<Share>);
    save(shares: Share[]): Promise<Share[]>;
    deleteByIds(ids: string[]): Promise<void>;
    delete(share: Share): Promise<void>;
    find(filter: FindOptionsWhere<Share>): Promise<Share[]>;
    findOne(filter: FindOptionsWhere<Share>): Promise<Share | null>;
    findUserShare(fileId?: string, folderId?: string, userId?: string): Promise<Share | null>;
}
