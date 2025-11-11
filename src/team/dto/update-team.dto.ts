import { IsOptional, IsString } from 'class-validator';

/**
 * DTO for updating team info.
 * Only name and description can be updated.
 */
export class UpdateTeamDTO {

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
