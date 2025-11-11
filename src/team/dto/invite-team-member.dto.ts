import { IsArray, ArrayNotEmpty, IsEmail, ArrayUnique } from 'class-validator';

/**
 * DTO for inviting new members to a team.
 */
export class InviteMembersDTO {

    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsEmail({}, { each: true })
    emails: string[];

}
