import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtAuthService } from 'src/common/utils/jwt-auth.service';
import { UserRepository } from 'src/user/repository/user-repo-impl';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { VerificationDTO } from './dto/verification.dto';
import { HashingService } from 'src/common/utils/hashing.service';
import { NotificationService } from 'src/notification/notification.service';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { InviteVerificationDto } from './dto/invite.dto';
import { User, User as UserEntity } from 'src/user/entities/user.entity';
import { AccountStatus, UserRoles } from 'src/user/user.enums';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';


/**
 * 
 */
@Injectable()
export class AuthService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly jwtAuthService: JwtAuthService,
        private readonly hashingService: HashingService,
    ) { }

    // Get current user
    async currentUser(userId: string): Promise<User> {
        const user = await this.userRepo.findById(userId);
        if (!user) throw new NotFoundException('This user. does not exist')

        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            status: user.status,
            role: user.role
        } as User;
    }

    // Verify invitation token and optionally create/activate user
    async verifyInvitation(dto: InviteVerificationDto): Promise<User> {

        const userExist = await this.userRepo.findByEmailWithHiddenFields(dto.email);

        if (!userExist) throw new NotFoundException('This email does not exist');
        console.log(AccountStatus[userExist.status])
        if (AccountStatus[userExist.status] === AccountStatus.ACTIVE) {
            throw new ForbiddenException('Account already active.')
        }

        // Check if user have used this password previously (past 3 times)
        for (const oldHash of userExist.previousPasswords!) {
            const match = await this.hashingService.verify(dto.password, oldHash);
            if (match) throw new BadRequestException('You cannot reuse any of your last passwords');
        }

        // Ensure that new password is not same as temporary password
        const tempPswMatch = await this.hashingService.verify(dto.temporaryPassword, userExist.tempPasswordHash);
        if (!tempPswMatch) throw new BadRequestException('Invalid temporary password');

        const pswHash = await this.hashingService.hash(dto.password);
        let user: User = { ...userExist };

        user.previousPasswords?.unshift(pswHash)
        user.status = AccountStatus.ACTIVE;
        user.passwordHash = pswHash;

        await this.userRepo.updateById(user.id ?? '', user);
        user.previousPasswords = undefined;
        return user;
    }

    // Verify OTP token
    async verifyOTP(dto: VerificationDTO, token: string): Promise<Record<string, any>> {
        try {
            const decoded = this.jwtAuthService.verify(token) as any;
            // token should carry code and email
            const tokenCode = decoded?.code;
            const email = decoded?.email;
            if (!tokenCode || !email) throw new BadRequestException('Invalid token payload');
            if (tokenCode !== dto.code) throw new BadRequestException('Invalid verification code');

            return decoded as Record<string, any>;
        } catch (e) {
            throw new BadRequestException('Invalid or expired verification token');
        }
    }


    async resetPassword(dto: ResetPasswordDTO): Promise<boolean> {
        try {
            const decoded = this.jwtAuthService.verify(dto.token) as any;
            // token should carry code and email
            const tokenCode = decoded?.code;
            const email = decoded?.email;
            if (!tokenCode || !email) throw new BadRequestException('Invalid token payload');

            if (tokenCode !== dto.code) throw new BadRequestException('Invalid verification code');

            const user = await this.userRepo.findByEmailWithHiddenFields(email);
            if (!user) throw new BadRequestException('User not found');

            const newHash = await this.hashingService.hash(dto.newPassword);
            await this.userRepo.updateById(user.id!, { passwordHash: newHash } as any);
            return true;
        } catch (e) {
            throw new BadRequestException('Invalid or expired reset token');
        }
    }

    // Initiate forgot password: generate short code, sign it, email the code, and return token
    async initiateForgotPassword(dto: ForgotPasswordDTO): Promise<{ token: string }> {
        const user = await this.userRepo.findByEmailWithHiddenFields(dto.email);
        if (!user) throw new BadRequestException('User not found');

        // generate numeric 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const token = this.jwtAuthService.sign({ email: dto.email, code, purpose: 'reset' }, '10m');

        // send code via notification service
        // await this.notificationService.sendMail(dto.email, 'Your password reset code', `Your verification code is: ${code}. It expires in 10 minutes.`);

        return { token };
    }


    // Login: returns a JWT that expires in 15 minutes and refresh token that last for 7 days
    async login(dto: LoginDto): Promise<{ accessToken: string, refreshToken: string, user: User }> {
        const user = await this.userRepo.findByEmailWithHiddenFields(dto.email);
        if (!user) throw new BadRequestException('Invalid credentials');
        log({ user })
        const ok = await this.hashingService.verify(dto.password, user.passwordHash!);
        if (!ok) throw new BadRequestException('Invalid credentials');

        console.log({ user });
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status
        };

        const accessToken = this.jwtAuthService.sign(payload, '7d');
        const refreshToken = this.jwtAuthService.sign(payload, '7d');

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                status: user.status,
                role: user.role,
            } as User
        };
    }

    // Refresh Token: 
    async refresh(dto: { token: string }) {
        try {
            const payload: User = this.jwtAuthService.verify(dto.token);
            const newAccessToken = this.jwtAuthService.sign(payload, '15m');
            return { accessToken: newAccessToken };
        } catch {
            throw new Error('Invalid refresh token');
        }
    }

}

