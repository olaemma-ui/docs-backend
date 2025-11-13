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
exports.TeamController = void 0;
const common_1 = require("@nestjs/common");
const team_service_1 = require("./team.service");
const create_team_dto_1 = require("./dto/create-team.dto");
const update_team_dto_1 = require("./dto/update-team.dto");
const current_user_decorator_1 = require("../core/decorators/current-user.decorator");
const user_entity_1 = require("../user/entities/user.entity");
const auth_guard_1 = require("../core/guard/auth.guard");
const verification_guard_1 = require("../core/guard/verification.guard");
const invite_team_member_dto_1 = require("./dto/invite-team-member.dto");
const base_response_dto_1 = require("../common/dto/base-response.dto");
let TeamController = class TeamController {
    teamService;
    constructor(teamService) {
        this.teamService = teamService;
    }
    create(admin, createTeamDto) {
        return this.teamService.createTeam(admin, createTeamDto);
    }
    async inviteMembers(user, teamId, dto) {
        const response = await this.teamService.inviteMembers(teamId, dto, user);
        return response;
    }
    async findAllTeams(user, page = 1, limit = 10, search) {
        const teams = await this.teamService.getAllTeams(user, page, limit, search);
        return base_response_dto_1.BaseResponse.makeSuccessResponse(teams.data, {
            total: teams.total,
            currentPage: page,
            totalPages: teams.page,
        }, 'Fetched all teams', 200);
    }
    async getUserTeams(user, page = 1, limit = 10, search) {
        const teams = await this.teamService.getUserTeams(user, page, limit, search);
        return base_response_dto_1.BaseResponse.makeSuccessResponse(teams.data, {
            total: teams.total,
            currentPage: page,
            totalPages: teams.page,
        }, 'Fetched your teams', 200);
    }
    async findOne(user, teamId) {
        const team = await this.teamService.findTeamById(user, teamId);
        return base_response_dto_1.BaseResponse.makeSuccessResponse(team, null, 'Fetched Team details', 200);
    }
    update(user, teamId, updateTeamDto) {
        return this.teamService.updateTeam(user, teamId, updateTeamDto);
    }
    removeTeamMember(user, userId, teamId) {
        return this.teamService.removeMember(user, teamId, userId);
    }
};
exports.TeamController = TeamController;
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        create_team_dto_1.CreateTeamDTO]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('invite/:teamId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('teamId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, invite_team_member_dto_1.InviteMembersDTO]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "inviteMembers", null);
__decorate([
    (0, common_1.Get)('all'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object, Object, String]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "findAllTeams", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object, Object, String]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "getUserTeams", null);
__decorate([
    (0, common_1.Get)(':teamId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':teamId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('teamId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, update_team_dto_1.UpdateTeamDTO]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':teamId/member/:userId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Param)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "removeTeamMember", null);
exports.TeamController = TeamController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, verification_guard_1.VerificationGuard),
    (0, common_1.Controller)('team'),
    __metadata("design:paramtypes", [team_service_1.TeamService])
], TeamController);
//# sourceMappingURL=team.controller.js.map