import { IsNotEmpty, IsString, IsUUID, Matches } from "class-validator";
import { AccountStatus } from "../user.enums";


export class UpdateUserDTO {

    @IsNotEmpty({message: "This field is required"})
    @IsUUID('4', { message: 'User ID must be a valid UUID' })
    userId: string;


    @Matches('BLACKLIST | ACTIVE')
    @IsString()
    @IsNotEmpty({message: "This field is required"})
    status: AccountStatus
}