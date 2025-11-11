import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UploadFileDto {
    @IsNotEmpty({ message: 'File name is required' })
    @IsString({ message: 'File name must be a string' })
    fileName: string;

    @IsOptional()
    @IsUUID('4', { message: 'Folder ID must be a valid UUID' })
    folderId?: string;
}
