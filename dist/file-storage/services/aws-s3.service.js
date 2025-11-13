"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsS3Service = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let AwsS3Service = class AwsS3Service {
    configService;
    s3Client;
    bucketName;
    constructor(configService) {
        this.configService = configService;
        this.bucketName = this.configService.getOrThrow('AWS_S3_BUCKET_NAME');
        this.s3Client = new client_s3_1.S3Client({
            region: this.configService.get('AWS_REGION'),
        });
    }
    async uploadFile(file) {
        try {
            const key = `${(0, uuid_1.v4)()}-${file.originalname}`;
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
            const response = await this.s3Client.send(command);
            const fileUrl = await this.getFileUrl(key);
            const fileEntity = {
                key,
                url: fileUrl,
                size: file.size,
                mimeType: file.mimetype,
                name: file.originalname,
                versionId: response.VersionId ?? null,
            };
            return fileEntity;
        }
        catch (error) {
            console.error('Upload Error:', error);
            throw new common_1.InternalServerErrorException('File upload failed');
        }
    }
    async getFileUrl(key) {
        const command = new client_s3_1.GetObjectCommand({ Bucket: this.bucketName, Key: key });
        return await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn: 3600 });
    }
    async deleteFile(key) {
        try {
            const command = new client_s3_1.DeleteObjectCommand({ Bucket: this.bucketName, Key: key });
            await this.s3Client.send(command);
        }
        catch (error) {
            console.error('Delete File Error:', error);
            throw new common_1.InternalServerErrorException('Failed to delete file');
        }
    }
};
exports.AwsS3Service = AwsS3Service;
exports.AwsS3Service = AwsS3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AwsS3Service);
//# sourceMappingURL=aws-s3.service.js.map