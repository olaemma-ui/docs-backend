import { FileEntity } from 'src/files/entities/file.entity';
export declare abstract class FileStorageService {
    abstract uploadFile(file: Express.Multer.File): Promise<FileEntity>;
    abstract getFileUrl(key: string): Promise<string>;
    abstract deleteFile(key: string): Promise<void>;
}
