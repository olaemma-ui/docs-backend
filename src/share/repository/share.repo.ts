import { Share } from '../entities/share.entity';
import { User } from 'src/user/entities/user.entity';
import { Team } from 'src/team/entities/team.entity';
import { FindOptionsWhere } from 'typeorm';

export abstract class IShareRepository {
    /**
     * Save multiple shares
     * @param shares - array of Share entities to save
     */
    abstract save(shares: Share[]): Promise<Share[]>;

    /**
     * Delete shares by IDs
     */
    abstract deleteByIds(ids: string[]): Promise<void>;

    /**
     * Delete shares matching a filter
     */
    abstract delete(filter: Partial<Share>): Promise<void>;

    /**
     * Find all shares matching a filter
     */
    abstract find(filter: FindOptionsWhere<Share>): Promise<Share[]>;

    /**
     * Find a single share matching a filter
     */
    abstract findOne(filter: FindOptionsWhere<Share>, relations?: string[]): Promise<Share | null>;

    /**
     * Find a single share matching a filter
     */
    abstract findUserShare(fileId: string, folderId: string, userId: string): Promise<Share | null>;
}
