import { AwsS3Service } from 'src/file-storage/services/aws-s3.service';
import { FolderRepository } from 'src/folders/repository/folder.repo-impl';
import { User as UserEntity } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repository/user-repo-impl';
import { FileRepository } from './repository/file.repo-impl';
import { FileEntity } from './entities/file.entity';
import { UploadFileDto } from './dto/upload-file.dto';
import { FilesQueryDto } from './dto/files-query.dto';
import { ShareRepository } from 'src/share/repository/share.repo-impl';
export declare class FilesService {
    private readonly fileStorage;
    private readonly folderRepo;
    private readonly userRepo;
    private readonly fileRepo;
    private readonly shareRepo;
    constructor(fileStorage: AwsS3Service, folderRepo: FolderRepository, userRepo: UserRepository, fileRepo: FileRepository, shareRepo: ShareRepository);
    uploadFile(file: Express.Multer.File, dto: UploadFileDto, userData: UserEntity): Promise<FileEntity>;
    getFilesInFolderForUser(dto: FilesQueryDto, requester: UserEntity): Promise<{
        data: FileEntity[];
        meta: {
            total: number;
            currentPage: number;
            totalPages: number;
        };
    }>;
}
