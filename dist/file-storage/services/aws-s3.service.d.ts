import { ConfigService } from '@nestjs/config';
import { FileStorageService } from '../file-storage.interface';
import { FileEntity } from 'src/files/entities/file.entity';
export declare class AwsS3Service implements FileStorageService {
    private readonly configService;
    private readonly s3Client;
    private readonly bucketName;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File): Promise<FileEntity>;
    getFileUrl(key: string): Promise<string>;
    deleteFile(key: string): Promise<void>;
}
