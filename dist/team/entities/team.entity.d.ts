import { TeamMember } from './team-member.entity';
import { User } from 'src/user/entities/user.entity';
export declare class Team {
    id?: string;
    name: string;
    description?: string;
    creator: User;
    members?: TeamMember[];
    createdAt?: Date;
    updatedAt?: Date;
}
