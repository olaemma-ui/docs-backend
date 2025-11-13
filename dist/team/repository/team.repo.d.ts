import { Team } from '../entities/team.entity';
import { User } from 'src/user/entities/user.entity';
import { TeamMember } from '../entities/team-member.entity';
export declare abstract class ITeamRepository {
    abstract createTeam(team: Team): Promise<Team>;
    abstract findById(teamId: string): Promise<Team | null>;
    abstract findByIds(teamIds: string[]): Promise<Team[]>;
    abstract findAllByUser(user: User, options?: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        data: Team[];
        total: number;
        page: number;
        limit: number;
    }>;
    abstract findAllTeams(options?: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        data: Team[];
        total: number;
        page: number;
        limit: number;
    }>;
    abstract deleteTeam(teamId: string): Promise<void>;
    abstract updateTeam(teamId: string, updateData: Partial<Team>): Promise<Team>;
    abstract removeTeamMember(member: TeamMember): Promise<TeamMember>;
    abstract inviteTeamMembers(members: TeamMember[]): Promise<TeamMember[]>;
}
