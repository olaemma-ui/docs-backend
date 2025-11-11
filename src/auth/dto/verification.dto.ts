import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerificationDTO {
    @IsString()
    @IsNotEmpty({ message: 'Verification code is required' })
    code: string;

    @IsNotEmpty({message: 'Your email is required'})
    @IsEmail({}, {message: 'Provide a valid email address'})
    email: string;
}
