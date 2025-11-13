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
var AuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("../../common/utils");
let AuthGuard = AuthGuard_1 = class AuthGuard {
    jwtService;
    logger = new common_1.Logger(AuthGuard_1.name);
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader)
            throw new common_1.BadRequestException('Authorization header is required');
        if (!authHeader.includes('Bearer'))
            throw new common_1.BadRequestException('Invalid authorization token1');
        const token = authHeader.split(' ')[1];
        try {
            const payload = this.jwtService.verify(token);
            request.user = payload;
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new common_1.UnauthorizedException('Token expired');
            }
            throw new common_1.UnauthorizedException('Invalid token');
        }
        return true;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = AuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [utils_1.JwtAuthService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map