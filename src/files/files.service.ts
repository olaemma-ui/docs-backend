import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { AwsS3Service } from 'src/file-storage/services/aws-s3.service';
import { Folder } from 'src/folders/entities/folder.entity';
import { FolderRepository } from 'src/folders/repository/folder.repo-impl';
import { User as UserEntity } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repository/user-repo-impl';
import { validate as isUuid } from 'uuid';
import { FileRepository } from './repository/file.repo-impl';
import { FileEntity } from './entities/file.entity';
import { UploadFileDto } from './dto/upload-file.dto';
import { FilesQueryDto } from './dto/files-query.dto';
import { PermissionService } from 'src/folders/permission.service';

@Injectable()
export class FilesService {

    constructor(
        private readonly fileStorage: AwsS3Service,
        private readonly folderRepo: FolderRepository,
        private readonly userRepo: UserRepository,
        private readonly fileRepo: FileRepository,
        private readonly permissionService: PermissionService,
    ) { }


    async uploadFile(
        file: Express.Multer.File,
        dto: UploadFileDto,
        userData: UserEntity
    ): Promise<FileEntity> {

        if (!isUuid(dto.folderId)) {
            throw new BadRequestException('Invalid folder ID');
        }

        const folderExist = await this.folderRepo.findFolderById(dto.folderId ?? '', userData.id ?? '');
        log({ folderExist })
        if (!folderExist) throw new NotFoundException('This folder does not exist');

        const userExist = await this.userRepo.findById(userData.id ?? '');
        if (!userExist) throw new NotFoundException('This user does not exist')

        let uploadedFile: FileEntity = await this.fileStorage.uploadFile(file);
        uploadedFile = {
            ...uploadedFile,
            name: dto.fileName,
            uploader: userExist,
            folder: folderExist,
        }

        log({ uploadedFile })
        let fileData = await this.fileRepo.createFile(uploadedFile);


        return {
            id: fileData.id,
            name: fileData.name,
            key: fileData.key,
            url: fileData.url,
            size: fileData.size,
            mimeType: fileData.mimeType,
            version: fileData.version,
            versionId: fileData.versionId,
        } as FileEntity;
    }
    /**
     * Get all files uploaded by a particular user in a folder, with pagination, sorting, filtering, and access control.
     */
    async getFilesInFolderForUser(
        dto: FilesQueryDto,
        requester: UserEntity
    ): Promise<{
        data: FileEntity[];
        meta: {
            total: number;
            currentPage: number;
            totalPages: number;
        }
    }> {
        // Permission check: must be owner or have share permission
        const hasAccess = await this.permissionService.hasPermission(
            requester.id ?? '',
            dto.folderId,
            'VIEWER',
        );
        if (!hasAccess) throw new ForbiddenException('You do not have permission to view files in this folder');

        // Parse filters
        const filters: any = {};
        if (dto.keyWord) filters.keyWord = dto.keyWord;
        if (dto.mimeType) filters.mimeType = dto.mimeType;
        if (dto.minSize) filters.minSize = dto.minSize;
        if (dto.maxSize) filters.maxSize = dto.maxSize;
        if (dto.dateFrom) filters.dateFrom = new Date(dto.dateFrom);
        if (dto.dateTo) filters.dateTo = new Date(dto.dateTo);

        const sort = {
            sortBy: dto.sortBy,
            sortOrder: dto.sortOrder,
        };

        return this.fileRepo.findByFolderAndUploader(
            dto.folderId,
            dto.uploaderId,
            dto.pageNumber,
            dto.pageSize,
            filters,
            sort,
        );
    }
}
