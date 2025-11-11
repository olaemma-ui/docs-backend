import { IsOptional, IsString, IsNumber, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindFolderDto {
    // @IsString()
    // userid: string;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    parentId?: string | null;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageNumber?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageSize?: number = 10;

    @IsOptional()
    @IsEnum(['createdAt', 'name'])
    sortBy?: 'createdAt' | 'name' = 'createdAt';

    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
