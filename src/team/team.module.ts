import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { TeamMember } from './entities/team-member.entity';
import { TeamMemberRepository } from './repository/team-member.repo-impl';
import { TeamRepository } from './repository/team.repo-impl';
import { User } from 'src/user/entities/user.entity';
import { NotificationService } from 'src/notification/notification.service';
import { UserModule } from 'src/user/user.module';
import { NotificationModule } from '../notification/notification.module';
import { CommonsModule } from 'src/common/commons.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, TeamMember, User]),
    UserModule,
    NotificationModule,
    CommonsModule,
  ],
  controllers: [TeamController,],
  providers: [TeamService, TeamRepository, TeamMemberRepository],
})
export class TeamModule { }
