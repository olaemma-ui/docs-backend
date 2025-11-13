import { Share } from '../entities/share.entity';
import { FindOptionsWhere } from 'typeorm';
export declare abstract class IShareRepository {
    abstract save(shares: Share[]): Promise<Share[]>;
    abstract deleteByIds(ids: string[]): Promise<void>;
    abstract delete(filter: Partial<Share>): Promise<void>;
    abstract find(filter: FindOptionsWhere<Share>): Promise<Share[]>;
    abstract findOne(filter: FindOptionsWhere<Share>): Promise<Share | null>;
    abstract findUserShare(fileId: string, folderId: string, userId: string): Promise<Share | null>;
}
