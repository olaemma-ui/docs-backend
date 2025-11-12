import {
    IsArray,
    ArrayNotEmpty,
    IsOptional,
    IsUUID,
    IsString,
} from 'class-validator';
import { AtLeastOne } from './at-least-one.validator';

/**
 * DTO: ShareRevokeDTO
 *
 * Use this to revoke access. You can revoke:
 *  - for specific user(s) and/or team(s)
 *  - or revoke entire share for a file/folder (pass fileId/folderId with no recipients -> revoke all)
 *
 * Rules:
 *  - Either fileId or folderId is required
 *  - At least one of (userIds, teamIds) OR none (to revoke all) is acceptable.
 *
 * Examples:
 *  - Revoke for specific users:
 *    { "fileId": "...", "userIds": ["..."] }
 *
 *  - Revoke for entire file:
 *    { "fileId": "..." }
 */
@AtLeastOne(['fileId', 'folderId'], { message: 'Provide fileId or folderId to revoke' })
export class ShareRevokeDTO {
    @IsOptional()
    @IsUUID('4', { message: 'fileId must be a valid UUID' })
    fileId?: string;

    @IsOptional()
    @IsUUID('4', { message: 'folderId must be a valid UUID' })
    folderId?: string;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty({ message: 'userIds cannot be empty when provided' })
    @IsUUID('4', { each: true, message: 'Each userId must be a valid UUID' })
    userIds?: string[];

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty({ message: 'teamIds cannot be empty when provided' })
    @IsUUID('4', { each: true, message: 'Each teamId must be a valid UUID' })
    teamIds?: string[];

    @IsOptional()
    @IsString()
    reason?: string;
}
