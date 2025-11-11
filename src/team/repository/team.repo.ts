import { Team } from '../entities/team.entity';
import { User } from 'src/user/entities/user.entity';
import { TeamMember } from '../entities/team-member.entity';

/**
 * ITeamRepository
 *
 * Abstract repository for managing Teams and Team Members.
 * Defines the contract that any concrete implementation must follow.
 */
export abstract class ITeamRepository {
    /** Create a new team */
    abstract createTeam(team: Team): Promise<Team>;

    /** Find a team by its ID including creator and members */
    abstract findById(teamId: string): Promise<Team | null>;

    /** Find all teams a user belongs to (creator or member) with pagination */
    abstract findAllByUser(
        user: User,
        options?: { page?: number; limit?: number; search?: string }
    ): Promise<{ data: Team[]; total: number; page: number; limit: number }>;

    /** Find all teams with optional search and pagination */
    abstract findAllTeams(
        options?: { page?: number; limit?: number; search?: string }
    ): Promise<{ data: Team[]; total: number; page: number; limit: number }>;

    /** Delete a team by ID */
    abstract deleteTeam(teamId: string): Promise<void>;

    /** Update team info (name, description) */
    abstract updateTeam(teamId: string, updateData: Partial<Team>): Promise<Team>;

    /** Remove a member from a team */
    abstract removeTeamMember(member: TeamMember): Promise<TeamMember>;

    /** Invite new members to a team */
    abstract inviteTeamMembers(members: TeamMember[]): Promise<TeamMember[]>;
}
