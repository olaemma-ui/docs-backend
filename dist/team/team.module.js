"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamModule = void 0;
const common_1 = require("@nestjs/common");
const team_service_1 = require("./team.service");
const team_controller_1 = require("./team.controller");
const typeorm_1 = require("@nestjs/typeorm");
const team_entity_1 = require("./entities/team.entity");
const team_member_entity_1 = require("./entities/team-member.entity");
const team_member_repo_impl_1 = require("./repository/team-member.repo-impl");
const team_repo_impl_1 = require("./repository/team.repo-impl");
const user_entity_1 = require("../user/entities/user.entity");
const user_module_1 = require("../user/user.module");
const notification_module_1 = require("../notification/notification.module");
const commons_module_1 = require("../common/commons.module");
let TeamModule = class TeamModule {
};
exports.TeamModule = TeamModule;
exports.TeamModule = TeamModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([team_entity_1.Team, team_member_entity_1.TeamMember, user_entity_1.User]),
            user_module_1.UserModule,
            notification_module_1.NotificationModule,
            commons_module_1.CommonsModule,
        ],
        controllers: [team_controller_1.TeamController,],
        providers: [team_service_1.TeamService, team_repo_impl_1.TeamRepository, team_member_repo_impl_1.TeamMemberRepository],
    })
], TeamModule);
//# sourceMappingURL=team.module.js.map