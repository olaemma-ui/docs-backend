
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDTO {
    @IsString()
    @IsNotEmpty({ message: 'Token is required' })
    token: string;

    @IsString()
    @IsNotEmpty({ message: 'Verification code is required' })
    code: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    @IsNotEmpty({ message: 'Password is required' })
    newPassword: string;
}