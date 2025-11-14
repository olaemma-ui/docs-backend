import { Module } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { UserModule } from 'src/user/user.module';
import { FolderRepository } from './repository/folder.repo-impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { User } from 'src/user/entities/user.entity';
import { CommonsModule } from 'src/common/commons.module';
import { FileRepository } from 'src/files/repository/file.repo-impl';
import { Share } from 'src/share/entities/share.entity';
import { ShareRepository } from 'src/share/repository/share.repo-impl';
import { UserRepository } from 'src/user/repository/user-repo-impl';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [FoldersController],
  providers: [
    FoldersService,
    FolderRepository,
    ShareRepository,
    UserRepository,
  ],
  imports: [
    UserModule,
    FilesModule,
    CommonsModule,
    TypeOrmModule.forFeature([Folder, User, File, Share])],
})
export class FoldersModule { }
