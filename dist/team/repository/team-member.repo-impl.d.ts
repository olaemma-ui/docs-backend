import { Repository } from 'typeorm';
import { TeamMember, InviteStatus } from '../entities/team-member.entity';
import { ITeamMemberRepository } from './team-member.repo';
export declare class TeamMemberRepository extends ITeamMemberRepository {
    private readonly memberRepo;
    constructor(memberRepo: Repository<TeamMember>);
    findById(memberId: string, teamId: string): Promise<TeamMember | null>;
    findMembersByTeam(teamId: string): Promise<TeamMember[]>;
    updateInviteStatus(memberId: string, status: InviteStatus): Promise<void>;
    findPendingInvites(userId: string): Promise<TeamMember[]>;
}
