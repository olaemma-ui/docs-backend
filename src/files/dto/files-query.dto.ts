import { IsOptional, IsUUID, IsInt, Min, IsEnum, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class FilesQueryDto {
    @IsUUID()
    folderId: string;

    @IsOptional()
    @IsUUID()
    uploaderId?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageNumber: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageSize: number = 10;

    @IsOptional()
    @IsEnum(['createdAt', 'name', 'size'])
    sortBy?: 'createdAt' | 'name' | 'size' = 'createdAt';

    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC' = 'DESC';

    @IsOptional()
    @IsString()
    keyWord?: string;
    
    @IsOptional()
    @IsString()
    mimeType?: string;

    @IsOptional()
    @Type(() => Number)
    minSize?: number;

    @IsOptional()
    @Type(() => Number)
    maxSize?: number;

    @IsOptional()
    @IsDateString()
    dateFrom?: string;

    @IsOptional()
    @IsDateString()
    dateTo?: string;
}
