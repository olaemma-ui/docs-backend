"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoldersModule = void 0;
const common_1 = require("@nestjs/common");
const folders_service_1 = require("./folders.service");
const folders_controller_1 = require("./folders.controller");
const user_module_1 = require("../user/user.module");
const folder_repo_impl_1 = require("./repository/folder.repo-impl");
const typeorm_1 = require("@nestjs/typeorm");
const folder_entity_1 = require("./entities/folder.entity");
const user_entity_1 = require("../user/entities/user.entity");
const commons_module_1 = require("../common/commons.module");
const share_entity_1 = require("../share/entities/share.entity");
const share_repo_impl_1 = require("../share/repository/share.repo-impl");
const user_repo_impl_1 = require("../user/repository/user-repo-impl");
const files_module_1 = require("../files/files.module");
let FoldersModule = class FoldersModule {
};
exports.FoldersModule = FoldersModule;
exports.FoldersModule = FoldersModule = __decorate([
    (0, common_1.Module)({
        controllers: [folders_controller_1.FoldersController],
        providers: [
            folders_service_1.FoldersService,
            folder_repo_impl_1.FolderRepository,
            share_repo_impl_1.ShareRepository,
            user_repo_impl_1.UserRepository,
        ],
        imports: [
            user_module_1.UserModule,
            files_module_1.FilesModule,
            commons_module_1.CommonsModule,
            typeorm_1.TypeOrmModule.forFeature([folder_entity_1.Folder, user_entity_1.User, File, share_entity_1.Share])
        ],
    })
], FoldersModule);
//# sourceMappingURL=folders.module.js.map