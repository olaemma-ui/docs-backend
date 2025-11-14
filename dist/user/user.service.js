"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_repo_impl_1 = require("./repository/user-repo-impl");
const user_enums_1 = require("./user.enums");
const notification_service_1 = require("../notification/notification.service");
const config_service_1 = require("@nestjs/config/dist/config.service");
const console_1 = require("console");
const utils_1 = require("../common/utils/utils");
const hashing_service_1 = require("../common/utils/hashing.service");
let UserService = class UserService {
    userRepo;
    config;
    notificationService;
    hashingService;
    constructor(userRepo, config, notificationService, hashingService) {
        this.userRepo = userRepo;
        this.config = config;
        this.notificationService = notificationService;
        this.hashingService = hashingService;
    }
    async createUser(dto, admin) {
        const userExist = await this.userRepo.findByEmailWithHiddenFields(dto.email);
        const adminExist = await this.userRepo.findById(admin.id ?? '');
        if (userExist)
            throw new common_1.ConflictException('User with this email already exist');
        if (!adminExist)
            throw new common_1.UnauthorizedException('Invalid or wrong admin id');
        (0, console_1.log)({ admin });
        if (admin.role !== user_enums_1.UserRoles.ADMIN && admin.role !== user_enums_1.UserRoles.SUPER_ADMIN) {
            throw new common_1.UnauthorizedException("You do not have access to this resource!");
        }
        const tempPassword = utils_1.Utils.fastRandomString(12);
        const tempPasswordHash = await this.hashingService.hash(tempPassword);
        let newUser = {
            email: dto.email,
            fullName: dto.fullName,
            tempPasswordHash: tempPasswordHash,
            status: user_enums_1.AccountStatus.PENDING,
            role: user_enums_1.UserRoles[dto.userRole],
            creatorId: admin.creatorId,
        };
        const userCreated = await this.userRepo.create(newUser);
        await this.notificationService.sendProfileCreatedMail(dto.email, dto.fullName, tempPassword, `${this.config.getOrThrow('WEB_APP_URL')}/auth/verify-invite`);
        return userCreated;
    }
    async createSuperAdmin(dto, xAuthRoleHeader) {
        const expected = this.config.get('X_AUTH_ROLE');
        if (!expected)
            throw new common_1.ForbiddenException('Server not configured to accept super admin creation');
        if (!xAuthRoleHeader || xAuthRoleHeader !== expected) {
            throw new common_1.ForbiddenException('Invalid X-AUTH-ROLE header');
        }
        const userExist = await this.userRepo.findByEmail(dto.email);
        if (userExist)
            throw new common_1.ConflictException('User with this email already exist');
        const tempPassword = 'Testing@1';
        const tempPasswordHash = await this.hashingService.hash(tempPassword);
        const newUser = {
            email: dto.email,
            fullName: dto.fullName,
            tempPasswordHash: tempPasswordHash,
            status: user_enums_1.AccountStatus.PENDING,
            role: user_enums_1.UserRoles.SUPER_ADMIN,
            createdAt: new Date(),
        };
        const userCreated = await this.userRepo.create(newUser);
        await this.notificationService.sendProfileCreatedMail(dto.email, dto.fullName, tempPassword, `${this.config.getOrThrow('WEB_APP_URL')}/auth/verify-invite`);
        return newUser;
    }
    async getAllUsersCreatedByAnAdmin(admin, pageNumber, pageSize, order) {
        const userExist = await this.userRepo.findById(admin.id);
        if (!userExist)
            throw new common_1.NotFoundException('User does not exist');
        if (userExist.role !== user_enums_1.UserRoles.ADMIN)
            throw new common_1.ForbiddenException();
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
        };
    }
    async getAllUsers(admin, pageNumber, pageSize, search, order) {
        const userExist = await this.userRepo.findById(admin.id);
        if (!userExist)
            throw new common_1.NotFoundException('User does not exist');
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
        };
    }
    async updateUserStatusOrRole(dto, admin) {
        const userExist = await this.userRepo.findById(dto.userId);
        if (!userExist)
            throw new common_1.NotFoundException('User not found');
        if (userExist.status == user_enums_1.AccountStatus.PENDING)
            throw new common_1.BadRequestException('User profile not active!.');
        const adminExist = await this.userRepo.findById(admin.id);
        if (!adminExist)
            throw new common_1.NotFoundException('User does not exist');
        if (adminExist.role !== user_enums_1.UserRoles.ADMIN)
            throw new common_1.ForbiddenException();
        userExist.status = dto.status;
        const user = this.userRepo.create(userExist);
        return user;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repo_impl_1.UserRepository,
        config_service_1.ConfigService,
        notification_service_1.NotificationService,
        hashing_service_1.HashingService])
], UserService);
//# sourceMappingURL=user.service.js.map