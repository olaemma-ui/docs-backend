"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesModule = void 0;
const common_1 = require("@nestjs/common");
const files_service_1 = require("./files.service");
const files_controller_1 = require("./files.controller");
const aws_s3_service_1 = require("../file-storage/services/aws-s3.service");
const typeorm_1 = require("@nestjs/typeorm");
const folder_entity_1 = require("../folders/entities/folder.entity");
const folder_repo_impl_1 = require("../folders/repository/folder.repo-impl");
const user_repo_impl_1 = require("../user/repository/user-repo-impl");
const user_entity_1 = require("../user/entities/user.entity");
const commons_module_1 = require("../common/commons.module");
const file_repo_impl_1 = require("./repository/file.repo-impl");
const file_entity_1 = require("./entities/file.entity");
const folders_module_1 = require("../folders/folders.module");
const share_repo_impl_1 = require("../share/repository/share.repo-impl");
const share_entity_1 = require("../share/entities/share.entity");
let FilesModule = class FilesModule {
};
exports.FilesModule = FilesModule;
exports.FilesModule = FilesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([folder_entity_1.Folder, user_entity_1.User, file_entity_1.FileEntity, share_entity_1.Share]),
            commons_module_1.CommonsModule,
            folders_module_1.FoldersModule,
        ],
        controllers: [files_controller_1.FilesController],
        providers: [
            files_service_1.FilesService, aws_s3_service_1.AwsS3Service,
            file_repo_impl_1.FileRepository, folder_repo_impl_1.FolderRepository,
            user_repo_impl_1.UserRepository, share_repo_impl_1.ShareRepository
        ],
    })
], FilesModule);
//# sourceMappingURL=files.module.js.map