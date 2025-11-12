import { Module } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { UserModule } from 'src/user/user.module';
import { FolderRepository } from './repository/folder.repo-impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { User } from 'src/user/entities/user.entity';
import { CommonsModule } from 'src/common/commons.module';

@Module({
  controllers: [FoldersController],
  providers: [FoldersService, FolderRepository,],
  imports: [
    UserModule,
    CommonsModule,
    TypeOrmModule.forFeature([Folder, User])],
})
export class FoldersModule { }
