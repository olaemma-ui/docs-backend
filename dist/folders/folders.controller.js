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
exports.FoldersController = void 0;
const common_1 = require("@nestjs/common");
const folders_service_1 = require("./folders.service");
const create_folder_dto_1 = require("./dto/create-folder.dto");
const update_folder_dto_1 = require("./dto/update-folder.dto");
const find_folder_dto_1 = require("./dto/find-folder.dto");
const base_response_dto_1 = require("../common/dto/base-response.dto");
const user_entity_1 = require("../user/entities/user.entity");
const auth_guard_1 = require("../core/guard/auth.guard");
const current_user_decorator_1 = require("../core/decorators/current-user.decorator");
let FoldersController = class FoldersController {
    foldersService;
    constructor(foldersService) {
        this.foldersService = foldersService;
    }
    async create(createFolderDto, request) {
        const user = request.user;
        const data = await this.foldersService.create(createFolderDto, user.id ?? '');
        return base_response_dto_1.BaseResponse.makeSuccessResponse(data, null, 'Folder created successfully.');
    }
    async findAll(dto, user) {
        const data = await this.foldersService.findAllFolder(user.id ?? '', dto);
        return base_response_dto_1.BaseResponse.makeSuccessResponse(data, null, 'All folders fetched successfully.');
    }
    async findUserFolders(dto, user) {
        const data = await this.foldersService.findUserFolders(user.id ?? '', dto);
        return base_response_dto_1.BaseResponse.makeSuccessResponse(data.data, data.meta, 'User folders fetched successfully.');
    }
    async renameFolder(dto, user, folderId) {
        const data = await this.foldersService.renameFolder(dto, user.id ?? '', folderId);
        return base_response_dto_1.BaseResponse.makeSuccessResponse(data, null, 'Folder renamed successfully.');
    }
    async getFolderDetails(folderId, user) {
        const data = await this.foldersService.findFolderByUser(user.id, folderId);
        return base_response_dto_1.BaseResponse.makeSuccessResponse(data, null, 'Folder fetched successfully.');
    }
    async deleteFolder(id, request, user) {
        return base_response_dto_1.BaseResponse.makeSuccessResponse(id, null, 'Folder deleted successfully.');
    }
};
exports.FoldersController = FoldersController;
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_folder_dto_1.CreateFolderDto, Object]),
    __metadata("design:returntype", Promise)
], FoldersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_folder_dto_1.FindFolderDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], FoldersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_folder_dto_1.FindFolderDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], FoldersController.prototype, "findUserFolders", null);
__decorate([
    (0, common_1.Patch)('rename'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)("folderId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_folder_dto_1.UpdateFolderDto,
        user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], FoldersController.prototype, "renameFolder", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], FoldersController.prototype, "getFolderDetails", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], FoldersController.prototype, "deleteFolder", null);
exports.FoldersController = FoldersController = __decorate([
    (0, common_1.Controller)('folders'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [folders_service_1.FoldersService])
], FoldersController);
//# sourceMappingURL=folders.controller.js.map