import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Team } from './team.entity';
import { User } from 'src/user/entities/user.entity';

export enum TeamMemberRole {
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
}

export enum InviteStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    DECLINED = 'DECLINED',
}

@Entity('team_members')
export class TeamMember {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Team, (team) => team.members)
    team: Team;

    @ManyToOne(() => User)
    user: User;

    @Column({ enum: TeamMemberRole, default: TeamMemberRole.MEMBER })
    role: TeamMemberRole;

    @Column({ enum: InviteStatus, default: InviteStatus.PENDING })
    inviteStatus: InviteStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
