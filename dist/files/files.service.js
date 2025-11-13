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
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const console_1 = require("console");
const aws_s3_service_1 = require("../file-storage/services/aws-s3.service");
const folder_repo_impl_1 = require("../folders/repository/folder.repo-impl");
const user_repo_impl_1 = require("../user/repository/user-repo-impl");
const uuid_1 = require("uuid");
const file_repo_impl_1 = require("./repository/file.repo-impl");
const share_repo_impl_1 = require("../share/repository/share.repo-impl");
let FilesService = class FilesService {
    fileStorage;
    folderRepo;
    userRepo;
    fileRepo;
    shareRepo;
    constructor(fileStorage, folderRepo, userRepo, fileRepo, shareRepo) {
        this.fileStorage = fileStorage;
        this.folderRepo = folderRepo;
        this.userRepo = userRepo;
        this.fileRepo = fileRepo;
        this.shareRepo = shareRepo;
    }
    async uploadFile(file, dto, userData) {
        if (!(0, uuid_1.validate)(dto.folderId)) {
            throw new common_1.BadRequestException('Invalid folder ID');
        }
        const folderExist = await this.folderRepo.findFolderById(dto.folderId ?? '', userData.id ?? '');
        (0, console_1.log)({ folderExist });
        if (!folderExist)
            throw new common_1.NotFoundException('This folder does not exist');
        const userExist = await this.userRepo.findById(userData.id ?? '');
        if (!userExist)
            throw new common_1.NotFoundException('This user does not exist');
        let uploadedFile = await this.fileStorage.uploadFile(file);
        uploadedFile = {
            ...uploadedFile,
            name: dto.fileName,
            uploader: userExist,
            folder: folderExist,
        };
        (0, console_1.log)({ uploadedFile });
        let fileData = await this.fileRepo.createFile(uploadedFile);
        return {
            id: fileData.id,
            name: fileData.name,
            key: fileData.key,
            url: fileData.url,
            size: fileData.size,
            mimeType: fileData.mimeType,
            version: fileData.version,
            versionId: fileData.versionId,
        };
    }
    async getFilesInFolderForUser(dto, requester) {
        const filters = {};
        if (dto.keyWord)
            filters.keyWord = dto.keyWord;
        if (dto.mimeType)
            filters.mimeType = dto.mimeType;
        if (dto.minSize)
            filters.minSize = dto.minSize;
        if (dto.maxSize)
            filters.maxSize = dto.maxSize;
        if (dto.dateFrom)
            filters.dateFrom = new Date(dto.dateFrom);
        if (dto.dateTo)
            filters.dateTo = new Date(dto.dateTo);
        const sort = {
            sortBy: dto.sortBy,
            sortOrder: dto.sortOrder,
        };
        return this.fileRepo.findByFolderAndUploader(dto.folderId, dto.uploaderId, dto.pageNumber, dto.pageSize, filters, sort);
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [aws_s3_service_1.AwsS3Service,
        folder_repo_impl_1.FolderRepository,
        user_repo_impl_1.UserRepository,
        file_repo_impl_1.FileRepository,
        share_repo_impl_1.ShareRepository])
], FilesService);
//# sourceMappingURL=files.service.js.map