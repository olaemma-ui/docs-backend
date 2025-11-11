import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDTO {
    @IsEmail({}, { message: 'Enter a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;
}
