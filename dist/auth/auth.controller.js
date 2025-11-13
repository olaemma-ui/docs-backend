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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const invite_dto_1 = require("./dto/invite.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const base_response_dto_1 = require("../common/dto/base-response.dto");
const user_entity_1 = require("../user/entities/user.entity");
const auth_guard_1 = require("../core/guard/auth.guard");
const current_user_decorator_1 = require("../core/decorators/current-user.decorator");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async currentUser(user) {
        const data = await this.authService.currentUser(user.id || '');
        return new base_response_dto_1.BaseResponse({
            data: data,
            message: "Profile fetched!.",
            statusCode: common_1.HttpStatus.OK,
        });
    }
    async login(dto) {
        const data = await this.authService.login(dto);
        return new base_response_dto_1.BaseResponse({
            data: data,
            message: "Login successful",
            statusCode: common_1.HttpStatus.OK,
        });
    }
    async refresh(dto) {
        const data = await this.authService.refresh(dto);
        return new base_response_dto_1.BaseResponse({
            data: data,
            message: "Token refreshed",
            statusCode: common_1.HttpStatus.OK,
        });
    }
    async verify(dto) {
        const data = await this.authService.verifyInvitation(dto);
        return new base_response_dto_1.BaseResponse({
            data: data,
            message: "Profile verification successful",
            statusCode: common_1.HttpStatus.OK,
        });
    }
    async reset(dto) {
        const data = await this.authService.resetPassword(dto);
        return new base_response_dto_1.BaseResponse({
            data: data,
            message: "Profile verification successful",
            statusCode: common_1.HttpStatus.OK,
        });
    }
    async forgot(dto) {
        const data = await this.authService.initiateForgotPassword(dto);
        return new base_response_dto_1.BaseResponse({
            data: data,
            message: "Verification code sent!",
            statusCode: common_1.HttpStatus.OK,
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "currentUser", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('verify-invite'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invite_dto_1.InviteVerificationDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "reset", null);
__decorate([
    (0, common_1.Post)('forgot'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgot", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map