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
exports.VerificationGuard = void 0;
const common_1 = require("@nestjs/common");
const console_1 = require("console");
const utils_1 = require("../../common/utils");
const user_enums_1 = require("../../user/user.enums");
let VerificationGuard = class VerificationGuard {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader)
            throw new common_1.BadRequestException('Authorization header is required');
        if (!authHeader.includes('Bearer '))
            throw new common_1.BadRequestException('Invalid authorization token3');
        const token = authHeader.split(' ')[1];
        console.log({ authHeader });
        try {
            const payload = this.jwtService.verify(token);
            (0, console_1.log)({ payload });
            if (payload.status === user_enums_1.AccountStatus.BLACKLIST) {
                throw new common_1.UnauthorizedException("You've been blacklisted, reach out to the admin!.");
            }
            if (payload.status !== user_enums_1.AccountStatus.ACTIVE) {
                throw new common_1.UnauthorizedException('Verify your account and try again!!');
            }
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid or expired token4');
        }
        return true;
    }
};
exports.VerificationGuard = VerificationGuard;
exports.VerificationGuard = VerificationGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [utils_1.JwtAuthService])
], VerificationGuard);
//# sourceMappingURL=verification.guard.js.map