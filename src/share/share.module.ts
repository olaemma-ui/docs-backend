import { Module } from '@nestjs/common';
import { ShareService } from './share.service';
import { ShareController } from './share.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Share } from './entities/share.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { Folder } from 'src/folders/entities/folder.entity';
import { UserModule } from 'src/user/user.module';
import { FoldersModule } from 'src/folders/folders.module';
import { TeamModule } from 'src/team/team.module';
import { FilesModule } from 'src/files/files.module';
import { CommonsModule } from 'src/common/commons.module';
import { NotificationModule } from 'src/notification/notification.module';
import { ShareRepository } from './repository/share.repo-impl';
import { TeamRepository } from 'src/team/repository/team.repo-impl';
import { FileRepository } from 'src/files/repository/file.repo-impl';
import { FolderRepository } from 'src/folders/repository/folder.repo-impl';
import { User } from 'src/user/entities/user.entity';
import { Team } from 'src/team/entities/team.entity';
import { TeamMember } from 'src/team/entities/team-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Share, FileEntity, Folder, User, Team, TeamMember]),
    UserModule,
    FoldersModule,
    TeamModule,
    FilesModule,
    CommonsModule,
    NotificationModule,
  ],
  controllers: [ShareController],
  providers: [
    ShareService, ShareRepository,
    TeamRepository, FileRepository,
    FolderRepository
  ],
})
export class ShareModule { }