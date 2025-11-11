import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileStorageService } from '../file-storage.interface';
import { FileEntity } from 'src/files/entities/file.entity';

@Injectable()
export class AwsS3Service implements FileStorageService {
    private readonly s3Client: S3Client;
    private readonly bucketName: string;

    constructor(private readonly configService: ConfigService) {
        this.bucketName = this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');
        this.s3Client = new S3Client({
            region: this.configService.get<string>('AWS_REGION'),
            // credentials: {
            //     accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
            //     secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
            // },
        });
    }

    /**
     * Upload file to AWS S3
     */
    async uploadFile(file: Express.Multer.File): Promise<FileEntity> {
        try {
            const key = `${uuidv4()}-${file.originalname}`;

            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            });

            const response = await this.s3Client.send(command);

            const fileUrl = await this.getFileUrl(key);

            const fileEntity: FileEntity = {
                key,
                url: fileUrl,
                size: file.size,
                mimeType: file.mimetype,
                name: file.originalname,
                versionId: response.VersionId ?? null,
            } as FileEntity;

            return fileEntity;
        } catch (error) {
            console.error('Upload Error:', error);
            throw new InternalServerErrorException('File upload failed');
        }
    }

    /**
     * Generate signed URL for a file
     */
    async getFileUrl(key: string): Promise<string> {
        const command = new GetObjectCommand({ Bucket: this.bucketName, Key: key });
        return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    }

    /**
     * List all files in the bucket
     */
    // async listFiles(): Promise<FileEntity[]> {
    //     try {
    //         const command = new ListObjectsV2Command({ Bucket: this.bucketName });
    //         const { Contents } = await this.s3Client.send(command);

    //         if (!Contents || Contents.length === 0) return [];

    //         const files = await Promise.all(
    //             Contents.map(async (item) => {
    //                 const fileUrl = await this.getFileUrl(item.Key);
    //                 return {
    //                     key: item.Key,
    //                     url: fileUrl,
    //                     size: item.Size,
    //                     mimeType: '', // S3 doesn’t store this directly — you’d need metadata for that
    //                     name: item.Key.split('-').slice(1).join('-'),
    //                     createdAt: item.LastModified,
    //                     updatedAt: item.LastModified,
    //                 } as FileEntity;
    //             }),
    //         );

    //         return files;
    //     } catch (error) {
    //         console.error('List Files Error:', error);
    //         throw new InternalServerErrorException('Failed to list files');
    //     }
    // }

    /**
     * Delete file from bucket
     */
    async deleteFile(key: string): Promise<void> {
        try {
            const command = new DeleteObjectCommand({ Bucket: this.bucketName, Key: key });
            await this.s3Client.send(command);
        } catch (error) {
            console.error('Delete File Error:', error);
            throw new InternalServerErrorException('Failed to delete file');
        }
    }
}
