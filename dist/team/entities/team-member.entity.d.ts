import { Team } from './team.entity';
import { User } from 'src/user/entities/user.entity';
export declare enum TeamMemberRole {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER"
}
export declare enum InviteStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    DECLINED = "DECLINED"
}
export declare class TeamMember {
    id: string;
    team: Team;
    user: User;
    role: TeamMemberRole;
    inviteStatus: InviteStatus;
    createdAt: Date;
    updatedAt: Date;
}
