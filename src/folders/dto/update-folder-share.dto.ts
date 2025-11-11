import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SharePermission } from '../entities/folder-share.entity';

export class UpdateFolderShareDto {
    @IsOptional()
    @IsEnum(SharePermission)
    permission?: SharePermission;

    @IsOptional()
    @IsString()
    granteeId?: string;
}
