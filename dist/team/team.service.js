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
exports.TeamService = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("../notification/notification.service");
const team_repo_impl_1 = require("./repository/team.repo-impl");
const team_member_entity_1 = require("./entities/team-member.entity");
const user_repo_impl_1 = require("../user/repository/user-repo-impl");
const team_member_repo_impl_1 = require("./repository/team-member.repo-impl");
let TeamService = class TeamService {
    userRepo;
    teamRepo;
    teamMemberRepo;
    notificationService;
    constructor(userRepo, teamRepo, teamMemberRepo, notificationService) {
        this.userRepo = userRepo;
        this.teamRepo = teamRepo;
        this.teamMemberRepo = teamMemberRepo;
        this.notificationService = notificationService;
    }
    async createTeam(admin, dto) {
        const userExist = await this.userRepo.findById(admin.id);
        if (!userExist)
            throw new common_1.NotFoundException('User not found!.');
        const team = await this.teamRepo.createTeam({
            name: dto.name,
            description: dto.description,
            creator: admin,
        });
        if (dto.members?.length) {
            const members = await this.inviteMembers(team.id, { emails: dto.members }, admin);
            for (const member of members) {
                this.notificationService.sendTeamInvitedMail(member.user.email, admin.fullName, team.name, member.user.fullName, `team/${team.id}`);
            }
        }
        return team;
    }
    async inviteMembers(teamId, dto, creator) {
        const userExist = await this.userRepo.findById(creator.id);
        if (!userExist)
            throw new common_1.NotFoundException('User not found!.');
        const teamExist = await this.teamRepo.findById(teamId);
        if (!teamExist)
            throw new common_1.NotFoundException('Team not found!.');
        if (!teamExist.creator.id)
            throw new common_1.InternalServerErrorException('The Team creator is missing, reach out to the developer!.');
        if (teamExist.creator.id !== userExist.id)
            throw new common_1.UnauthorizedException("Only Team creator can invite new members");
        const team = await this.teamRepo.findById(teamId);
        if (!team)
            throw new common_1.NotFoundException('Team not found');
        const newMembers = await Promise.all(dto.emails.map(async (email) => {
            const user = await this.userRepo.findByEmail(email);
            if (!user)
                throw new common_1.NotFoundException(`User with ${email} does not exist!`);
            const member = new team_member_entity_1.TeamMember();
            member.team = team;
            member.user = user;
            member.inviteStatus = team_member_entity_1.InviteStatus.PENDING;
            return member;
        }));
        const members = await this.teamRepo.inviteTeamMembers(newMembers);
        for (const member of members) {
            this.notificationService.sendTeamInvitedMail(member.user.email, creator.fullName, member.team.name, member.user.fullName, `team/${teamId}`);
        }
        return members;
    }
    async removeMember(user, teamId, memberId) {
        const userExist = await this.userRepo.findById(user.id);
        if (!userExist)
            throw new common_1.NotFoundException('User not found!.');
        const teamExist = await this.teamRepo.findById(teamId);
        if (!teamExist)
            throw new common_1.NotFoundException('Team not found!.');
        if (!teamExist.creator.id)
            throw new common_1.InternalServerErrorException('The Team creator is missing, reach out to the developer!.');
        if (teamExist.creator.id !== userExist.id)
            throw new common_1.UnauthorizedException("Only Team creator can revoke/remove members");
        const member = await this.teamMemberRepo.findById(memberId, teamId);
        if (!member)
            throw new common_1.NotFoundException('Member not found in this team');
        return await this.teamRepo.removeTeamMember(member);
    }
    async updateTeam(user, teamId, dto) {
        const userExist = await this.userRepo.findById(user.id);
        if (!userExist)
            throw new common_1.NotFoundException('User not found!.');
        const teamExist = await this.teamRepo.findById(teamId);
        if (!teamExist)
            throw new common_1.NotFoundException('Team not found!.');
        if (!teamExist.creator.id)
            throw new common_1.InternalServerErrorException('The Team creator is missing, reach out to the developer!.');
        if (teamExist.creator.id !== userExist.id)
            throw new common_1.UnauthorizedException("Only Team creator can update team data");
        return this.teamRepo.updateTeam(teamId, dto);
    }
    async getUserTeams(user, page = 1, limit = 10, search) {
        return this.teamRepo.findAllByUser(user, { page, limit, search });
    }
    async findTeamById(user, teamId) {
        return this.teamRepo.findById(teamId);
    }
    async getAllTeams(user, page = 1, limit = 10, search) {
        return this.teamRepo.findAllTeams({ page, limit, search });
    }
    async deleteTeam(teamId) {
        return this.teamRepo.deleteTeam(teamId);
    }
};
exports.TeamService = TeamService;
exports.TeamService = TeamService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repo_impl_1.UserRepository,
        team_repo_impl_1.TeamRepository,
        team_member_repo_impl_1.TeamMemberRepository,
        notification_service_1.NotificationService])
], TeamService);
//# sourceMappingURL=team.service.js.map