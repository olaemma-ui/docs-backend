import { TeamMember, InviteStatus } from '../entities/team-member.entity';
export declare abstract class ITeamMemberRepository {
    abstract findById(memberId: string, teamId: string): Promise<TeamMember | null>;
    abstract findMembersByTeam(teamId: string): Promise<TeamMember[]>;
    abstract updateInviteStatus(memberId: string, status: InviteStatus): Promise<void>;
    abstract findPendingInvites(userId: string): Promise<TeamMember[]>;
}
