import { Repository } from 'typeorm';
import { Team } from '../entities/team.entity';
import { TeamMember } from '../entities/team-member.entity';
import { User } from 'src/user/entities/user.entity';
import { ITeamRepository } from './team.repo';
export declare class TeamRepository extends ITeamRepository {
    private readonly teamRepo;
    private readonly memberRepo;
    constructor(teamRepo: Repository<Team>, memberRepo: Repository<TeamMember>);
    createTeam(teamData: Team): Promise<Team>;
    findById(teamId: string): Promise<Team | null>;
    findByIds(teamIds: string[]): Promise<Team[]>;
    findAllByUser(user: User, options?: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        data: Team[];
        total: number;
        page: number;
        limit: number;
    }>;
    findAllTeams(options?: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        data: Team[];
        total: number;
        page: number;
        limit: number;
    }>;
    deleteTeam(teamId: string): Promise<void>;
    updateTeam(teamId: string, updateData: Partial<Team>): Promise<Team>;
    removeTeamMember(member: TeamMember): Promise<TeamMember>;
    inviteTeamMembers(members: TeamMember[]): Promise<TeamMember[]>;
}
