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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const role_guard_1 = require("../core/guard/role.guard");
const base_response_dto_1 = require("../common/dto/base-response.dto");
const auth_guard_1 = require("../core/guard/auth.guard");
const verification_guard_1 = require("../core/guard/verification.guard");
const create_user_dto_1 = require("./dto/create-user.dto");
const user_entity_1 = require("./entities/user.entity");
const roles_decorator_1 = require("../core/decorators/roles.decorator");
const user_enums_1 = require("./user.enums");
const current_user_decorator_1 = require("../core/decorators/current-user.decorator");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async createUser(dto, user) {
        const data = await this.userService.createUser(dto, user);
        return new base_response_dto_1.BaseResponse({
            data: data,
            message: "User created successful",
            statusCode: common_1.HttpStatus.OK,
        });
    }
    async findAllUser(user, pageNumber, pageSize, search) {
        const data = await this.userService.getAllUsers(user, pageNumber, pageSize, search);
        return new base_response_dto_1.BaseResponse({
            data: data.data,
            meta: {
                total: data.total,
                totalPages: data.totalPages,
                currentPage: data.currentPage
            },
            message: "Users fetched successful",
            statusCode: common_1.HttpStatus.OK,
        });
    }
    async findAllUserByAdmin(user, pageNumber, pageSize) {
        const data = await this.userService.getAllUsersCreatedByAnAdmin(user, pageNumber, pageSize);
        return new base_response_dto_1.BaseResponse({
            data: data.data,
            meta: {
                total: data.total,
                totalPages: data.totalPages,
                currentPage: data.currentPage
            },
            message: "User fetched successful",
            statusCode: common_1.HttpStatus.OK,
        });
    }
    async createSuperAdmin(xAuthRole, dto) {
        const data = await this.userService.createSuperAdmin(dto, xAuthRole);
        return new base_response_dto_1.BaseResponse({
            data: data,
            message: 'Super admin created successfully',
            statusCode: common_1.HttpStatus.OK,
        });
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, verification_guard_1.VerificationGuard, role_guard_1.RolesGuard),
    (0, common_1.Post)('create'),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRoles.ADMIN, user_enums_1.UserRoles.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, verification_guard_1.VerificationGuard, role_guard_1.RolesGuard),
    (0, common_1.Get)('all'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number, Number, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAllUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, verification_guard_1.VerificationGuard, role_guard_1.RolesGuard),
    (0, common_1.Get)('all-created-by-admin'),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRoles.SUPER_ADMIN, user_enums_1.UserRoles.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAllUserByAdmin", null);
__decorate([
    (0, common_1.Post)('create-super-admin'),
    __param(0, (0, common_1.Headers)('x-auth-role')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createSuperAdmin", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map