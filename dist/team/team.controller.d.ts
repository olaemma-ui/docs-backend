import { TeamService } from './team.service';
import { CreateTeamDTO } from './dto/create-team.dto';
import { UpdateTeamDTO } from './dto/update-team.dto';
import { User } from 'src/user/entities/user.entity';
import { InviteMembersDTO } from './dto/invite-team-member.dto';
import { BaseResponse } from 'src/common/dto/base-response.dto';
export declare class TeamController {
    private readonly teamService;
    constructor(teamService: TeamService);
    create(admin: User, createTeamDto: CreateTeamDTO): Promise<import("./entities/team.entity").Team>;
    inviteMembers(user: User, teamId: string, dto: InviteMembersDTO): Promise<import("./entities/team-member.entity").TeamMember[]>;
    findAllTeams(user: User, page?: number, limit?: number, search?: string): Promise<BaseResponse<import("./entities/team.entity").Team[]>>;
    getUserTeams(user: User, page?: number, limit?: number, search?: string): Promise<BaseResponse<import("./entities/team.entity").Team[]>>;
    findOne(user: User, teamId: string): Promise<BaseResponse<import("./entities/team.entity").Team | null>>;
    update(user: User, teamId: string, updateTeamDto: UpdateTeamDTO): Promise<import("./entities/team.entity").Team>;
    removeTeamMember(user: User, userId: string, teamId: string): Promise<import("./entities/team-member.entity").TeamMember>;
}
