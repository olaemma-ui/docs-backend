import { FindOptionsWhere } from "typeorm";
import { User } from "../entities/user.entity";
import { FindUsersFilterOptions } from "../dto/find-user-filter.dto";



export interface IUserRepository {
    /**
     * Create a new user record.
     * @param payload partial user data required for creation (e.g. email, password, name)
     * @returns the created user object (including id)
     */
    create(payload: User): Promise<User>;

    /**
     * Find a user by its primary id.
     */
    findById(id: string): Promise<User | null>;
    
    /**
     * Find a user by its primary id.
     */
    findByIds(userIds: string[]): Promise<User[]>

    /**
     * Find one user by arbitrary filter.
     * @param filter an object containing fields to match
     */
    findOne(filter: Partial<User>): Promise<User | null>;

    /**
     * Find many users by filter with optional pagination and sorting.
     * @param filter filter object
     * @param options optional pagination and sort: { skip, take, order }
     */
    find(options: FindUsersFilterOptions): Promise<{
        data: User[];
        total: number;
        page: number;
        limit: number;
    }>;

    /**
     * Count users matching filter.
     */
    count(filter?: FindOptionsWhere<User>): Promise<number>;

    updateById(
        id: string,
        update: Partial<User>,
    ): Promise<User>;

    /**
     * Find user by email (common auth lookup)
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * List roles for a user
     */
    getRoles(id: string): Promise<string[]>;

}