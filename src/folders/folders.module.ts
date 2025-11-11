import { Module } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { UserModule } from 'src/user/user.module';
import { FolderRepository } from './repository/folder.repo-impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { User } from 'src/user/entities/user.entity';
import { CommonsModule } from 'src/common/commons.module';
import { FolderShare } from './entities/folder-share.entity';
import { FolderShareRepository } from './repository/folder-share.repo-impl';
import { PermissionService } from './permission.service';

@Module({
  controllers: [FoldersController],
  providers: [FoldersService, FolderRepository, FolderShareRepository, PermissionService],
  exports: [PermissionService, FolderShareRepository],
  imports: [
    UserModule,
    CommonsModule,
    TypeOrmModule.forFeature([Folder, User, FolderShare])],
})
export class FoldersModule { }
