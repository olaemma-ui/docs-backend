


import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { log } from 'console';
import { Observable } from 'rxjs';
import { JwtAuthService } from 'src/common/utils';
import { User } from 'src/user/entities/user.entity';
import { AccountStatus } from 'src/user/user.enums';

@Injectable()
export class VerificationGuard implements CanActivate {

    constructor(private readonly jwtService: JwtAuthService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const authHeader: string = request.headers.authorization;
        if (!authHeader) throw new BadRequestException('Authorization header is required');
        if (!authHeader.includes('Bearer ')) throw new BadRequestException('Invalid authorization token3');
        const token = authHeader.split(' ')[1]
        console.log({ authHeader })

        try {
            const payload: User = this.jwtService.verify(token);
            log({ payload })
            if (payload.status === AccountStatus.BLACKLIST) {
                throw new UnauthorizedException("You've been blacklisted, reach out to the admin!.")
            }
            if (payload.status !== AccountStatus.ACTIVE) {
                throw new UnauthorizedException('Verify your account and try again!!')
            }
        } catch (error) {
            throw new BadRequestException('Invalid or expired token4')
        }

        return true;
    }
}
