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
exports.ShareController = void 0;
const common_1 = require("@nestjs/common");
const share_service_1 = require("./share.service");
const auth_guard_1 = require("../core/guard/auth.guard");
const verification_guard_1 = require("../core/guard/verification.guard");
const share_create_dto_1 = require("./dto/share-create.dto");
const share_revoke_dto_1 = require("./dto/share-revoke.dto");
const current_user_decorator_1 = require("../core/decorators/current-user.decorator");
const user_entity_1 = require("../user/entities/user.entity");
const base_response_dto_1 = require("../common/dto/base-response.dto");
let ShareController = class ShareController {
    shareService;
    constructor(shareService) {
        this.shareService = shareService;
    }
    async share(dto, user) {
        const share = await this.shareService.share(user, dto);
        return base_response_dto_1.BaseResponse.makeSuccessResponse(share, null, 'Shared successfully', 201, '/share');
    }
    async revoke(dto, user) {
        await this.shareService.revoke(user, dto);
        return base_response_dto_1.BaseResponse.makeSuccessResponse(null, null, 'Share revoked successfully', 200, '/share');
    }
    async getFileShares(user, fileId) {
        const { users, teams } = await this.shareService.getFileOrFolderShares(fileId);
        return base_response_dto_1.BaseResponse.makeSuccessResponse({ users, teams }, { total: users.length + teams.length, currentPage: 1, totalPages: 1 }, 'File shares retrieved successfully', 200, `/share/file/${fileId}`);
    }
    async getFolderShares(user, folderId) {
        const { users, teams } = await this.shareService.getFileOrFolderShares(undefined, folderId);
        return base_response_dto_1.BaseResponse.makeSuccessResponse({ users, teams }, { total: users.length + teams.length, currentPage: 1, totalPages: 1 }, 'Folder shares retrieved successfully', 200, `/share/folder/${folderId}`);
    }
};
exports.ShareController = ShareController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [share_create_dto_1.ShareCreateDTO,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ShareController.prototype, "share", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [share_revoke_dto_1.ShareRevokeDTO,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ShareController.prototype, "revoke", null);
__decorate([
    (0, common_1.Get)('file/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], ShareController.prototype, "getFileShares", null);
__decorate([
    (0, common_1.Get)('folder/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], ShareController.prototype, "getFolderShares", null);
exports.ShareController = ShareController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, verification_guard_1.VerificationGuard),
    (0, common_1.Controller)('share'),
    __metadata("design:paramtypes", [share_service_1.ShareService])
], ShareController);
//# sourceMappingURL=share.controller.js.map