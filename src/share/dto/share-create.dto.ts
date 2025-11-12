import {
    IsArray,
    ArrayNotEmpty,
    IsOptional,
    IsUUID,
    IsEnum,
    IsString,
    IsEmail,
} from 'class-validator';
import { ShareAccess } from '../enums/share-access.enum';
import { AtLeastOne } from './at-least-one.validator';

/**
 * DTO: ShareCreateDTO
 *
 * Body for sharing a file or folder with users and/or teams.
 *
 * Examples:
 *  - Share file with multiple users:
 *    {
 *      "fileId": "uuid-file-1",
 *      "userIds": ["uuid-u1","uuid-u2"],
 *      "access": "VIEW"
 *    }
 *
 *  - Share folder with a team and a user:
 *    {
 *      "folderId": "uuid-folder-1",
 *      "teamIds": ["uuid-team-1"],
 *      "userIds": ["uuid-u3"],
 *      "access": "EDIT"
 *    }
 *
 * Validation rules:
 *  - Either fileId or folderId is required (AtLeastOne)
 *  - At least one recipient must be present (userIds or teamIds)
 *  - userIds and teamIds must be arrays of UUIDs (v4)
 */
@AtLeastOne(
    ['fileId', 'folderId'],
    { message: 'Provide either fileId or folderId' }
)
@AtLeastOne(
    ['emails', 'teamIds'],
    { message: 'Provide at least one recipient (emails or teamIds)' }
)
export class ShareCreateDTO {
    @IsOptional()
    @IsUUID('4', { message: 'fileId must be a valid UUID' })
    fileId?: string;

    @IsOptional()
    @IsUUID('4', { message: 'folderId must be a valid UUID' })
    folderId?: string;

    @IsOptional()
    @IsArray()
    // @ArrayNotEmpty({ message: 'Emails cannot be an empty array' })
    @IsEmail({}, { each: true, message: 'Each email must be a valid email address' })
    emails?: string[];

    @IsOptional()
    @IsArray()
    // @ArrayNotEmpty({ message: 'teamIds cannot be an empty array' })
    @IsUUID('4', { each: true, message: 'Each teamId must be a valid UUID' })
    teamIds?: string[];

    @IsEnum(ShareAccess, { message: 'access must be one of VIEW, EDIT, OWNER' })
    access: ShareAccess;

    @IsOptional()
    @IsString()
    note?: string; // optional message the sharer can include
}
