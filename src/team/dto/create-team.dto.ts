import { IsArray, IsNotEmpty, IsOptional, IsString, ArrayNotEmpty, ArrayUnique, IsUUID, IsEmail } from 'class-validator';

export class CreateTeamDTO {
    @IsString({ message: 'Team name must be a string' })
    @IsNotEmpty({ message: 'Team name is required' })
    name: string;

    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description?: string;

    @IsArray({ message: 'Members must be an array' })
    @ArrayNotEmpty({ message: 'At least one Team Member must be provided' })
    @ArrayUnique({ message: 'Members email must be unique' })
    @IsEmail({}, { each: true, message: 'Each email must be a valid email' })
    members: string[];
}
