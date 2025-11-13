import { NotificationService } from "src/notification/notification.service";
import { CreateTeamDTO } from "./dto/create-team.dto";
import { InviteMembersDTO } from "./dto/invite-team-member.dto";
import { UpdateTeamDTO } from "./dto/update-team.dto";
import { TeamRepository } from "./repository/team.repo-impl";
import { User } from "src/user/entities/user.entity";
import { TeamMember } from "./entities/team-member.entity";
import { Team } from "./entities/team.entity";
import { UserRepository } from "src/user/repository/user-repo-impl";
import { TeamMemberRepository } from "./repository/team-member.repo-impl";
export declare class TeamService {
    private readonly userRepo;
    private readonly teamRepo;
    private readonly teamMemberRepo;
    private readonly notificationService;
    constructor(userRepo: UserRepository, teamRepo: TeamRepository, teamMemberRepo: TeamMemberRepository, notificationService: NotificationService);
    createTeam(admin: User, dto: CreateTeamDTO): Promise<Team>;
    inviteMembers(teamId: string, dto: InviteMembersDTO, creator: User): Promise<TeamMember[]>;
    removeMember(user: User, teamId: string, memberId: string): Promise<TeamMember>;
    updateTeam(user: User, teamId: string, dto: UpdateTeamDTO): Promise<Team>;
    getUserTeams(user: User, page?: number, limit?: number, search?: string): Promise<{
        data: Team[];
        total: number;
        page: number;
        limit: number;
    }>;
    findTeamById(user: User, teamId: string): Promise<Team | null>;
    getAllTeams(user: User, page?: number, limit?: number, search?: string): Promise<{
        data: Team[];
        total: number;
        page: number;
        limit: number;
    }>;
    deleteTeam(teamId: string): Promise<void>;
}
