import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike, In } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from './user-repo';
import { FindUsersFilterOptions, } from '../dto/find-user-filter.dto';
import { filter } from 'rxjs';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,
    ) { }

    async create(payload: User): Promise<User> {
        const user = this.repo.create(payload);
        return this.repo.save(user);
    }


    findById(id: string): Promise<User | null> {
        return this.repo.findOneBy({ id });
    }

    findByIds(userIds: string[]): Promise<User[]> {
        return this.repo.find({
            where: {
                id: In(userIds),
            },
        });
    }

    findByEmails(emails: string[]): Promise<User[]> {
        return this.repo.find({
            where: {
                email: In(emails),
            },
        });
    }

    findOne(filter: Partial<User>): Promise<User | null> {
        const where = filter as FindOptionsWhere<User>;
        return this.repo.findOne({ where });
    }


    async find(options: FindUsersFilterOptions): Promise<{
        data: User[];
        total: number;
        page: number;
        limit: number;
    }> {

        const { page = 1, limit = 10, search, status, role, order, creatorId } = options;

        const skip = (page - 1) * limit;
        const take = limit || 10;

        const where: any = {};

        if (status) where.status = status;
        if (role) where.role = role;
        if (creatorId) where.creatorId = creatorId;

        const searchCondition = search
            ? [
                { ...where, fullName: ILike(`%${search}%`) },
                { ...where, email: ILike(`%${search}%`) },
            ]
            : where;

        const [data, total] = await this.repo.findAndCount({
            where: searchCondition,
            order,
            skip,
            take,
        });

        return { data, total, page, limit };
    }



    async count(filter?: FindOptionsWhere<User>): Promise<number> {
        return filter ? await this.repo.count({ where: filter }) : await this.repo.count();
    }

    async updateById(id: string, update: Partial<User>): Promise<User> {
        const entity = await this.repo.preload({ id, ...update });
        if (!entity) throw new NotFoundException('User not found');
        return this.repo.save(entity);
    }

    findByEmail(email: string): Promise<User | null> {
        return this.repo.findOne({ where: { email } });
    }

    async getRoles(id: string): Promise<string[]> {
        const user = await this.repo.findOne({ where: { id }, select: ['role'] });
        return user ? [user.role] : [];
    }
}
