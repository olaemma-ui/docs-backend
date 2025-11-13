import { User } from "../entities/user.entity";
import { AccountStatus, UserRoles } from "../user.enums";
export declare class FindUsersFilterOptions {
    page: number;
    limit: number;
    search?: string;
    creatorId?: string;
    status?: AccountStatus;
    role?: UserRoles;
    order?: Record<keyof User, 'ASC' | 'DESC'>;
}
