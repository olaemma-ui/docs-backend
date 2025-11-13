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
exports.TeamMemberRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const team_member_entity_1 = require("../entities/team-member.entity");
const team_member_repo_1 = require("./team-member.repo");
let TeamMemberRepository = class TeamMemberRepository extends team_member_repo_1.ITeamMemberRepository {
    memberRepo;
    constructor(memberRepo) {
        super();
        this.memberRepo = memberRepo;
    }
    async findById(memberId, teamId) {
        return this.memberRepo.findOne({
            where: {
                team: { id: teamId },
                id: memberId
            },
            relations: ['user', 'team'],
        });
    }
    async findMembersByTeam(teamId) {
        return this.memberRepo.find({
            where: { team: { id: teamId }, },
            relations: ['user', 'team'],
        });
    }
    async updateInviteStatus(memberId, status) {
        await this.memberRepo.update(memberId, { inviteStatus: status });
    }
    async findPendingInvites(userId) {
        return this.memberRepo.find({
            where: { user: { id: userId }, inviteStatus: team_member_entity_1.InviteStatus.PENDING },
            relations: ['team'],
        });
    }
};
exports.TeamMemberRepository = TeamMemberRepository;
exports.TeamMemberRepository = TeamMemberRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(team_member_entity_1.TeamMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TeamMemberRepository);
//# sourceMappingURL=team-member.repo-impl.js.map