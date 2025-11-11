import { IsOptional, IsString, IsUUID, Matches, Min } from "class-validator";
import { User } from "../entities/user.entity";
import { AccountStatus, UserRoles } from "../user.enums";


/**
 * 
 */
export class FindUsersFilterOptions {

    @Min(1, { message: "Page starts from 1" })
    page: number;

    @Min(1, { message: "Page limits starts from 1" })
    limit: number;

    @IsOptional()
    @IsString({ message: "Enter a valid search string" })
    search? : string; // search by name, email, etc.

    @IsOptional()
    @IsUUID('4', {message: 'CreatorID must be UUID'})
    creatorId? : string;

    @IsOptional()
    status?: AccountStatus;

    @IsOptional()
    role?: UserRoles;

    @IsOptional()
    @Matches('ASC | DESC')
    order?: Record<keyof User, 'ASC' | 'DESC'>;
}