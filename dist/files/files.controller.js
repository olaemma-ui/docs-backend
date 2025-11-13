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
exports.FilesController = void 0;
const common_1 = require("@nestjs/common");
const files_service_1 = require("./files.service");
const platform_express_1 = require("@nestjs/platform-express");
const user_entity_1 = require("../user/entities/user.entity");
const files_query_dto_1 = require("./dto/files-query.dto");
const current_user_decorator_1 = require("../core/decorators/current-user.decorator");
const base_response_dto_1 = require("../common/dto/base-response.dto");
const console_1 = require("console");
const auth_guard_1 = require("../core/guard/auth.guard");
const verification_guard_1 = require("../core/guard/verification.guard");
const upload_file_dto_1 = require("./dto/upload-file.dto");
let FilesController = class FilesController {
    filesService;
    constructor(filesService) {
        this.filesService = filesService;
    }
    async uploadFile(file, dto, request) {
        (0, console_1.log)({ dto });
        const data = await this.filesService.uploadFile(file, dto, request.user);
        return base_response_dto_1.BaseResponse.makeSuccessResponse(data, null, 'File Uploaded Successfully', common_1.HttpStatus.CREATED);
    }
    async getFiles(query, user) {
        const result = await this.filesService.getFilesInFolderForUser(query, user);
        return base_response_dto_1.BaseResponse.makeSuccessResponse(result.data, result.meta, 'Files fetched successfully', common_1.HttpStatus.OK);
    }
};
exports.FilesController = FilesController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, verification_guard_1.VerificationGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [new common_1.MaxFileSizeValidator({ maxSize: 209715200 }),]
    }))),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upload_file_dto_1.UploadFileDto, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [files_query_dto_1.FilesQueryDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getFiles", null);
exports.FilesController = FilesController = __decorate([
    (0, common_1.Controller)('files'),
    __metadata("design:paramtypes", [files_service_1.FilesService])
], FilesController);
//# sourceMappingURL=files.controller.js.map