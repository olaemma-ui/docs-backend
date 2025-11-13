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
exports.TeamRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const team_entity_1 = require("../entities/team.entity");
const team_member_entity_1 = require("../entities/team-member.entity");
const team_repo_1 = require("./team.repo");
let TeamRepository = class TeamRepository extends team_repo_1.ITeamRepository {
    teamRepo;
    memberRepo;
    constructor(teamRepo, memberRepo) {
        super();
        this.teamRepo = teamRepo;
        this.memberRepo = memberRepo;
    }
    async createTeam(teamData) {
        const team = this.teamRepo.create(teamData);
        return this.teamRepo.save(team);
    }
    async findById(teamId) {
        return this.teamRepo.findOne({
            where: { id: teamId },
            relations: ['creator', 'members', 'members.user'],
        });
    }
    async findByIds(teamIds) {
        return this.teamRepo.find({
            where: { id: (0, typeorm_2.In)(teamIds) },
            relations: ['creator', 'members', 'members.user'],
        });
    }
    async findAllByUser(user, options = {}) {
        const { page = 1, limit = 10, search } = options;
        const skip = (page - 1) * limit;
        const query = this.teamRepo
            .createQueryBuilder('team')
            .leftJoinAndSelect('team.members', 'member')
            .leftJoinAndSelect('team.creator', 'creator')
            .leftJoinAndSelect('member.user', 'memberUser')
            .addSelect(['creator.id', 'creator.fullName', 'creator.email'])
            .addSelect(['memberUser.id', 'memberUser.fullName', 'memberUser.email'])
            .loadRelationCountAndMap('team.memberCount', 'team.members')
            .where('creator.id = :userId OR memberUser.id = :userId', { userId: user.id });
        if (search) {
            query.andWhere('team.name ILIKE :search', { search: `%${search}%` });
        }
        query.orderBy('team.createdAt', 'DESC').skip(skip).take(limit);
        const [data, total] = await query.getManyAndCount();
        return { data, total, page, limit };
    }
    async findAllTeams(options = {}) {
        const { page = 1, limit = 10, search } = options;
        const skip = (page - 1) * limit;
        const query = this.teamRepo.createQueryBuilder('team');
        if (search)
            query.where('team.name ILIKE :search OR team.description ILIKE :search', {
                search: `%${search}%`,
            });
        query.orderBy('team.createdAt', 'DESC').skip(skip).take(limit);
        const [data, total] = await query.getManyAndCount();
        return { data, total, page, limit };
    }
    async deleteTeam(teamId) {
        await this.teamRepo.delete(teamId);
    }
    async updateTeam(teamId, updateData) {
        const team = await this.findById(teamId);
        if (!team)
            throw new common_1.NotFoundException('Team not found');
        Object.assign(team, updateData);
        return this.teamRepo.save(team);
    }
    async removeTeamMember(member) {
        return await this.memberRepo.remove(member);
    }
    async inviteTeamMembers(members) {
        return this.memberRepo.save(members);
    }
};
exports.TeamRepository = TeamRepository;
exports.TeamRepository = TeamRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(team_entity_1.Team)),
    __param(1, (0, typeorm_1.InjectRepository)(team_member_entity_1.TeamMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TeamRepository);
//# sourceMappingURL=team.repo-impl.js.map