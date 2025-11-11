import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { AwsS3Service } from 'src/file-storage/services/aws-s3.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from 'src/folders/entities/folder.entity';
import { FolderRepository } from 'src/folders/repository/folder.repo-impl';
import { UserRepository } from 'src/user/repository/user-repo-impl';
import { User } from 'src/user/entities/user.entity';
import { CommonsModule } from 'src/common/commons.module';
import { FileRepository } from './repository/file.repo-impl';
import { FileEntity } from './entities/file.entity';
import { FoldersModule } from 'src/folders/folders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Folder, User, FileEntity]),
    CommonsModule,
    FoldersModule,
  ],
  controllers: [FilesController],
  providers: [
    FilesService, AwsS3Service,
    FileRepository, FolderRepository,
    UserRepository
  ],
})
export class FilesModule { }
