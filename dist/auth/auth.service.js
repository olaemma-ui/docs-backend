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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_service_1 = require("../common/utils/jwt-auth.service");
const user_repo_impl_1 = require("../user/repository/user-repo-impl");
const hashing_service_1 = require("../common/utils/hashing.service");
const user_enums_1 = require("../user/user.enums");
const console_1 = require("console");
let AuthService = class AuthService {
    userRepo;
    jwtAuthService;
    hashingService;
    constructor(userRepo, jwtAuthService, hashingService) {
        this.userRepo = userRepo;
        this.jwtAuthService = jwtAuthService;
        this.hashingService = hashingService;
    }
    async currentUser(userId) {
        const user = await this.userRepo.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('This user. does not exist');
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            status: user.status,
            role: user.role
        };
    }
    async verifyInvitation(dto) {
        const userExist = await this.userRepo.findByEmail(dto.email);
        if (!userExist)
            throw new common_1.NotFoundException('This email does not exist');
        console.log(user_enums_1.AccountStatus[userExist.status]);
        if (user_enums_1.AccountStatus[userExist.status] === user_enums_1.AccountStatus.ACTIVE) {
            throw new common_1.ForbiddenException('Account already active.');
        }
        for (const oldHash of userExist.previousPasswords) {
            const match = await this.hashingService.verify(dto.password, oldHash);
            if (match)
                throw new common_1.BadRequestException('You cannot reuse any of your last passwords');
        }
        const tempPswMatch = await this.hashingService.verify(dto.temporaryPassword, userExist.tempPasswordHash);
        if (!tempPswMatch)
            throw new common_1.BadRequestException('Invalid temporary password');
        const pswHash = await this.hashingService.hash(dto.password);
        let user = { ...userExist };
        user.previousPasswords?.unshift(pswHash);
        user.status = user_enums_1.AccountStatus.ACTIVE;
        user.passwordHash = pswHash;
        await this.userRepo.updateById(user.id ?? '', user);
        user.previousPasswords = undefined;
        return user;
    }
    async verifyOTP(dto, token) {
        try {
            const decoded = this.jwtAuthService.verify(token);
            const tokenCode = decoded?.code;
            const email = decoded?.email;
            if (!tokenCode || !email)
                throw new common_1.BadRequestException('Invalid token payload');
            if (tokenCode !== dto.code)
                throw new common_1.BadRequestException('Invalid verification code');
            return decoded;
        }
        catch (e) {
            throw new common_1.BadRequestException('Invalid or expired verification token');
        }
    }
    async resetPassword(dto) {
        try {
            const decoded = this.jwtAuthService.verify(dto.token);
            const tokenCode = decoded?.code;
            const email = decoded?.email;
            if (!tokenCode || !email)
                throw new common_1.BadRequestException('Invalid token payload');
            if (tokenCode !== dto.code)
                throw new common_1.BadRequestException('Invalid verification code');
            const user = await this.userRepo.findByEmail(email);
            if (!user)
                throw new common_1.BadRequestException('User not found');
            const newHash = await this.hashingService.hash(dto.newPassword);
            await this.userRepo.updateById(user.id, { passwordHash: newHash });
            return true;
        }
        catch (e) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
    }
    async initiateForgotPassword(dto) {
        const user = await this.userRepo.findByEmail(dto.email);
        if (!user)
            throw new common_1.BadRequestException('User not found');
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const token = this.jwtAuthService.sign({ email: dto.email, code, purpose: 'reset' }, '10m');
        return { token };
    }
    async login(dto) {
        const user = await this.userRepo.findByEmail(dto.email);
        if (!user)
            throw new common_1.BadRequestException('Invalid credentials');
        (0, console_1.log)({ user });
        const ok = await this.hashingService.verify(dto.password, user.passwordHash);
        if (!ok)
            throw new common_1.BadRequestException('Invalid credentials');
        console.log({ user });
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status
        };
        const accessToken = this.jwtAuthService.sign(payload, '7d');
        const refreshToken = this.jwtAuthService.sign(payload, '7d');
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                status: user.status,
                role: user.role,
            }
        };
    }
    async refresh(dto) {
        try {
            const payload = this.jwtAuthService.verify(dto.token);
            const newAccessToken = this.jwtAuthService.sign(payload, '15m');
            return { accessToken: newAccessToken };
        }
        catch {
            throw new Error('Invalid refresh token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repo_impl_1.UserRepository,
        jwt_auth_service_1.JwtAuthService,
        hashing_service_1.HashingService])
], AuthService);
//# sourceMappingURL=auth.service.js.map