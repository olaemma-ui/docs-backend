import { UserRepository } from './repository/user-repo-impl';
import { User } from './entities/user.entity';
import { UpdateUserDTO } from './dto/update-user.dto';
import { NotificationService } from 'src/notification/notification.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from 'src/common/utils/hashing.service';
export declare class UserService {
    private readonly userRepo;
    private readonly config;
    private readonly notificationService;
    private readonly hashingService;
    constructor(userRepo: UserRepository, config: ConfigService, notificationService: NotificationService, hashingService: HashingService);
    createUser(dto: CreateUserDto, admin: User): Promise<User>;
    createSuperAdmin(dto: CreateUserDto, xAuthRoleHeader?: string): Promise<User>;
    getAllUsersCreatedByAnAdmin(admin: User, pageNumber?: number, pageSize?: number, order?: Record<keyof User, 'ASC' | 'DESC'>): Promise<{
        data: User[];
        total: number;
        currentPage: number;
        totalPages: number;
    }>;
    getAllUsers(admin: User, pageNumber?: number, pageSize?: number, search?: string, order?: Record<keyof User, 'ASC' | 'DESC'>): Promise<{
        data: User[];
        total: number;
        currentPage: number;
        totalPages: number;
    }>;
    updateUserStatusOrRole(dto: UpdateUserDTO, admin: User): Promise<User>;
}
