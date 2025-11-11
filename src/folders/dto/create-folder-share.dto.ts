import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { GranteeType, SharePermission } from '../entities/folder-share.entity';

export class CreateFolderShareDto {
    @IsEnum(GranteeType)
    granteeType!: GranteeType;

    @IsString()
    @IsNotEmpty()
    granteeId!: string; // user id or team id

    @IsEnum(SharePermission)
    permission!: SharePermission;
}
