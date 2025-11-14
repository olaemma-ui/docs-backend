import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './repository/user-repo-impl';
import { User } from './entities/user.entity';
import { UpdateUserDTO } from './dto/update-user.dto';
import { AccountStatus, UserRoles } from './user.enums';
import { NotificationService } from 'src/notification/notification.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { CreateUserDto } from './dto/create-user.dto';
import { log } from 'console';
import { Utils } from 'src/common/utils/utils';
import { HashingService } from 'src/common/utils/hashing.service';

@Injectable()
export class UserService {

    constructor(
        private readonly userRepo: UserRepository,
        private readonly config: ConfigService,
        private readonly notificationService: NotificationService,
        private readonly hashingService: HashingService,
    ) { }


    // 
    async createUser(dto: CreateUserDto, admin: User): Promise<User> {
        const userExist = await this.userRepo.findByEmailWithHiddenFields(dto.email);
        const adminExist = await this.userRepo.findById(admin.id ?? '');

        if (userExist) throw new ConflictException('User with this email already exist');
        if (!adminExist) throw new UnauthorizedException('Invalid or wrong admin id');

        log({ admin })
        if (admin.role !== UserRoles.ADMIN && admin.role !== UserRoles.SUPER_ADMIN) {
            throw new UnauthorizedException("You do not have access to this resource!");
        }

        const tempPassword = Utils.fastRandomString(12);
        const tempPasswordHash = await this.hashingService.hash(tempPassword)

        let newUser: User = {
            email: dto.email,
            fullName: dto.fullName,
            tempPasswordHash: tempPasswordHash,
            status: AccountStatus.PENDING,
            role: UserRoles[dto.userRole],
            creatorId: admin.creatorId,
        }

        const userCreated = await this.userRepo.create(newUser);

        await this.notificationService.sendProfileCreatedMail(
            dto.email,
            dto.fullName,
            tempPassword,
            `${this.config.getOrThrow('WEB_APP_URL')}/auth/verify-invite`,
        );

        return userCreated;

    }


    /**
    * Create a SUPER_ADMIN profile. The request must include X-AUTH-ROLE header
    * whose value matches the env variable `X_AUTH_ROLE` (or `AUTH_ROLE`) configured.
    */
    async createSuperAdmin(dto: CreateUserDto, xAuthRoleHeader?: string): Promise<User> {
        const expected = this.config.get<string>('X_AUTH_ROLE');
        if (!expected) throw new ForbiddenException('Server not configured to accept super admin creation');

        if (!xAuthRoleHeader || xAuthRoleHeader !== expected) {
            throw new ForbiddenException('Invalid X-AUTH-ROLE header');
        }

        const userExist = await this.userRepo.findByEmail(dto.email);
        if (userExist) throw new ConflictException('User with this email already exist');

        // generate a secure temporary password and hash it
        const tempPassword = 'Testing@1';
        const tempPasswordHash = await this.hashingService.hash(tempPassword);

        const newUser: User = {
            email: dto.email,
            fullName: dto.fullName,
            tempPasswordHash: tempPasswordHash,
            status: AccountStatus.PENDING,
            role: UserRoles.SUPER_ADMIN,
            createdAt: new Date(),
        } as User;

        const userCreated = await this.userRepo.create(newUser);

        // notify the created super admin with the temporary password
        await this.notificationService.sendProfileCreatedMail(
            dto.email,
            dto.fullName,
            tempPassword,
            `${this.config.getOrThrow('WEB_APP_URL')}/auth/verify-invite`,
        );

        return newUser;
    }


    async getAllUsersCreatedByAnAdmin(
        admin: User,
        pageNumber?: number,
        pageSize?: number,
        order?: Record<keyof User, 'ASC' | 'DESC'>
    ): Promise<{
        data: User[];
        total: number;
        currentPage: number;
        totalPages: number;
    }> {

        const userExist = await this.userRepo.findById(admin.id!);
        if (!userExist) throw new NotFoundException('User does not exist')
        if (userExist.role !== UserRoles.ADMIN) throw new ForbiddenException()

        const result = await this.userRepo.find({
            page: pageNumber ?? 1,
            limit: pageSize ?? 10,
            order: order,
            creatorId: admin.id
        });


        return {
            data: result.data,
            total: result.total,
            currentPage: result.page,
            totalPages: result.total,
        }

    }


    async getAllUsers(
        admin: User,
        pageNumber?: number,
        pageSize?: number,
        search?: string,
        order?: Record<keyof User, 'ASC' | 'DESC'>
    ): Promise<{
        data: User[];
        total: number;
        currentPage: number;
        totalPages: number;
    }> {

        const userExist = await this.userRepo.findById(admin.id!);
        if (!userExist) throw new NotFoundException('User does not exist')
        // if (userExist.role !== UserRoles.SUPER_ADMIN) throw new ForbiddenException()


        const result = await this.userRepo.find({
            page: pageNumber ?? 1,
            limit: pageSize ?? 10,
            order: order,
            search
        });

        return {
            data: result.data,
            total: result.total,
            currentPage: result.page,
            totalPages: result.total,
        }

    }


    async updateUserStatusOrRole(dto: UpdateUserDTO, admin: User): Promise<User> {

        const userExist = await this.userRepo.findById(dto.userId!);
        if (!userExist) throw new NotFoundException('User not found')
        if (userExist.status == AccountStatus.PENDING) throw new BadRequestException('User profile not active!.')

        const adminExist = await this.userRepo.findById(admin.id!);
        if (!adminExist) throw new NotFoundException('User does not exist')
        if (adminExist.role !== UserRoles.ADMIN) throw new ForbiddenException()

        userExist.status = dto.status;
        const user = this.userRepo.create(userExist);

        return user;

    }

}
