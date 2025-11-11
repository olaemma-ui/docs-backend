import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { UserRoles } from "src/user/user.enums";



export class CreateUserDto{
    
    @IsNotEmpty({message: 'Enter user email *'})
    @IsEmail({}, {message: 'Enter a valid email address'})
    email: string;

    @IsString({message: 'Enter a valid name *'})
    @IsNotEmpty({message: 'Enter user full name *'})
    fullName: string;

    @IsNotEmpty({message: 'Assign a role to this user'})
    @Matches(RegExp('ADMIN|SUPER_ADMIN|USER'), {message: 'Select a valid user role'})
    userRole: string;
    
}