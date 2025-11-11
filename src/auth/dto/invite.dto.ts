import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class InviteDto {
    @IsEmail({}, { message: 'Enter a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Full name is required' })
    fullName: string;

    @IsString()
    @IsNotEmpty({ message: 'roleId is required' })
    roleId: string;
}

export class InviteVerificationDto {

    @IsEmail({}, { message: 'Enter a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsNotEmpty({ message: 'Enter your temporary password' })
    temporaryPassword: string;
    
    @IsNotEmpty({ message: 'Enter your new password' })
    password: string;

}