import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Team } from '../entities/team.entity';
import { TeamMember, InviteStatus } from '../entities/team-member.entity';
import { User } from 'src/user/entities/user.entity';
import { ITeamRepository } from './team.repo';

/**
 * TeamRepository
 *
 * Concrete implementation of ITeamRepository using TypeORM.
 * Handles database operations for Teams and Team Members.
 */
@Injectable()
export class TeamRepository extends ITeamRepository {
    constructor(
        @InjectRepository(Team)
        private readonly teamRepo: Repository<Team>,
        @InjectRepository(TeamMember)
        private readonly memberRepo: Repository<TeamMember>,
    ) {
        super();
    }

    /** Create a new team */
    async createTeam(teamData: Team): Promise<Team> {
        const team = this.teamRepo.create(teamData);
        return this.teamRepo.save(team);
    }

    /** Find a team by ID */
    async findById(teamId: string): Promise<Team | null> {
        return this.teamRepo.findOne({
            where: { id: teamId },
            relations: ['creator', 'members', 'members.user'],
        });
    }

    async findByIds(teamIds: string[]): Promise<Team[]> {
        return this.teamRepo.find({
            where: { id: In(teamIds) },
            relations: ['creator', 'members', 'members.user'],
        });
    }

    /** Find all teams a user belongs to */
    async findAllByUser(
        user: User,
        options: { page?: number; limit?: number; search?: string } = {}
    ): Promise<{ data: Team[]; total: number; page: number; limit: number }> {
        const { page = 1, limit = 10, search } = options;
        const skip = (page - 1) * limit;

        const query = this.teamRepo
            .createQueryBuilder('team')
            .leftJoinAndSelect('team.members', 'member')
            .leftJoinAndSelect('team.creator', 'creator')
            .leftJoinAndSelect('member.user', 'memberUser')
            // ✅ Explicitly include creator and member fields
            .addSelect(['creator.id', 'creator.fullName', 'creator.email'])
            .addSelect(['memberUser.id', 'memberUser.fullName', 'memberUser.email'])
            // ✅ Count team members
            .loadRelationCountAndMap('team.memberCount', 'team.members')
            // ✅ Filter where user is creator or member
            .where('creator.id = :userId OR memberUser.id = :userId', { userId: user.id });

        if (search) {
            query.andWhere('team.name ILIKE :search', { search: `%${search}%` });
        }

        query.orderBy('team.createdAt', 'DESC').skip(skip).take(limit);

        const [data, total] = await query.getManyAndCount();

        return { data, total, page, limit };
    }


    /** Find all teams */
    async findAllTeams(
        options: { page?: number; limit?: number; search?: string } = {}
    ): Promise<{ data: Team[]; total: number; page: number; limit: number }> {
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


    /** Delete a team by ID */
    async deleteTeam(teamId: string): Promise<void> {
        await this.teamRepo.delete(teamId);
    }

    /** Update team info (name, description) */
    async updateTeam(teamId: string, updateData: Partial<Team>): Promise<Team> {
        const team = await this.findById(teamId);
        if (!team) throw new NotFoundException('Team not found');

        Object.assign(team, updateData); // Merge updates
        return this.teamRepo.save(team);
    }

    /** Remove a member from a team */
    async removeTeamMember(member: TeamMember): Promise<TeamMember> {
        return await this.memberRepo.remove(member);
    }

    /** Invite new members to a team */
    async inviteTeamMembers(members: TeamMember[]): Promise<TeamMember[]> {
        return this.memberRepo.save(members);
    }

}
