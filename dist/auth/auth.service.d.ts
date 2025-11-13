import { JwtAuthService } from 'src/common/utils/jwt-auth.service';
import { UserRepository } from 'src/user/repository/user-repo-impl';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { VerificationDTO } from './dto/verification.dto';
import { HashingService } from 'src/common/utils/hashing.service';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { InviteVerificationDto } from './dto/invite.dto';
import { User } from 'src/user/entities/user.entity';
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtAuthService;
    private readonly hashingService;
    constructor(userRepo: UserRepository, jwtAuthService: JwtAuthService, hashingService: HashingService);
    currentUser(userId: string): Promise<User>;
    verifyInvitation(dto: InviteVerificationDto): Promise<User>;
    verifyOTP(dto: VerificationDTO, token: string): Promise<Record<string, any>>;
    resetPassword(dto: ResetPasswordDTO): Promise<boolean>;
    initiateForgotPassword(dto: ForgotPasswordDTO): Promise<{
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: User;
    }>;
    refresh(dto: {
        token: string;
    }): Promise<{
        accessToken: string;
    }>;
}
