import { Express } from 'express';
import { FileEntity } from 'src/files/entities/file.entity';

export abstract class FileStorageService {
    abstract uploadFile(file: Express.Multer.File): Promise<FileEntity>;
    abstract getFileUrl(key: string): Promise<string>;
    // abstract listFiles(): Promise<string[]>;
    abstract deleteFile(key: string): Promise<void>;
}
