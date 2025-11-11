import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamMember, InviteStatus } from '../entities/team-member.entity';
import { ITeamMemberRepository } from './team-member.repo';

@Injectable()
export class TeamMemberRepository extends ITeamMemberRepository {
    constructor(
        @InjectRepository(TeamMember)
        private readonly memberRepo: Repository<TeamMember>,
    ) {
        super();
    }


    async findById(memberId: string, teamId: string): Promise<TeamMember | null> {
        return this.memberRepo.findOne({
            where: {
                team: { id: teamId },
                id: memberId
            },
            relations: ['user', 'team'],
        });
    }

    async findMembersByTeam(teamId: string): Promise<TeamMember[]> {
        return this.memberRepo.find({
            where: { team: { id: teamId }, },
            relations: ['user', 'team'],
        });
    }

    async updateInviteStatus(memberId: string, status: InviteStatus): Promise<void> {
        await this.memberRepo.update(memberId, { inviteStatus: status });
    }

    async findPendingInvites(userId: string): Promise<TeamMember[]> {
        return this.memberRepo.find({
            where: { user: { id: userId }, inviteStatus: InviteStatus.PENDING },
            relations: ['team'],
        });
    }
}
