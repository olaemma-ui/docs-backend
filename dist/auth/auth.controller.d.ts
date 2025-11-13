import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { InviteVerificationDto } from './dto/invite.dto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { BaseResponse } from 'src/common/dto/base-response.dto';
import { User } from 'src/user/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    currentUser(user: User): Promise<BaseResponse<User>>;
    login(dto: LoginDto): Promise<BaseResponse<{
        accessToken: string;
        user: User;
    }>>;
    refresh(dto: {
        token: string;
    }): Promise<BaseResponse<{
        accessToken: string;
    }>>;
    verify(dto: InviteVerificationDto): Promise<BaseResponse<User>>;
    reset(dto: ResetPasswordDTO): Promise<BaseResponse<boolean>>;
    forgot(dto: ForgotPasswordDTO): Promise<BaseResponse<{
        token: string;
    }>>;
}
