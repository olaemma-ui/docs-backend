"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareModule = void 0;
const common_1 = require("@nestjs/common");
const share_service_1 = require("./share.service");
const share_controller_1 = require("./share.controller");
const typeorm_1 = require("@nestjs/typeorm");
const share_entity_1 = require("./entities/share.entity");
const file_entity_1 = require("../files/entities/file.entity");
const folder_entity_1 = require("../folders/entities/folder.entity");
const user_module_1 = require("../user/user.module");
const folders_module_1 = require("../folders/folders.module");
const team_module_1 = require("../team/team.module");
const files_module_1 = require("../files/files.module");
const commons_module_1 = require("../common/commons.module");
const notification_module_1 = require("../notification/notification.module");
const share_repo_impl_1 = require("./repository/share.repo-impl");
const team_repo_impl_1 = require("../team/repository/team.repo-impl");
const file_repo_impl_1 = require("../files/repository/file.repo-impl");
const folder_repo_impl_1 = require("../folders/repository/folder.repo-impl");
const user_entity_1 = require("../user/entities/user.entity");
const team_entity_1 = require("../team/entities/team.entity");
const team_member_entity_1 = require("../team/entities/team-member.entity");
let ShareModule = class ShareModule {
};
exports.ShareModule = ShareModule;
exports.ShareModule = ShareModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([share_entity_1.Share, file_entity_1.FileEntity, folder_entity_1.Folder, user_entity_1.User, team_entity_1.Team, team_member_entity_1.TeamMember]),
            user_module_1.UserModule,
            folders_module_1.FoldersModule,
            team_module_1.TeamModule,
            files_module_1.FilesModule,
            commons_module_1.CommonsModule,
            notification_module_1.NotificationModule,
        ],
        controllers: [share_controller_1.ShareController],
        providers: [
            share_service_1.ShareService, share_repo_impl_1.ShareRepository,
            team_repo_impl_1.TeamRepository, file_repo_impl_1.FileRepository,
            folder_repo_impl_1.FolderRepository
        ],
    })
], ShareModule);
//# sourceMappingURL=share.module.js.map