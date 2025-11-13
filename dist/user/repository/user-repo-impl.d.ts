import { Repository, FindOptionsWhere } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from './user-repo';
import { FindUsersFilterOptions } from '../dto/find-user-filter.dto';
export declare class UserRepository implements IUserRepository {
    private readonly repo;
    constructor(repo: Repository<User>);
    create(payload: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByIds(userIds: string[]): Promise<User[]>;
    findByEmails(emails: string[]): Promise<User[]>;
    findOne(filter: Partial<User>): Promise<User | null>;
    find(options: FindUsersFilterOptions): Promise<{
        data: User[];
        total: number;
        page: number;
        limit: number;
    }>;
    count(filter?: FindOptionsWhere<User>): Promise<number>;
    updateById(id: string, update: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    getRoles(id: string): Promise<string[]>;
}
