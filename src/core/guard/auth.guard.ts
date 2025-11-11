import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { log } from 'console';
import { Observable } from 'rxjs';
import { JwtAuthService } from 'src/common/utils';

@Injectable()
export class AuthGuard implements CanActivate {

    private readonly logger = new Logger(AuthGuard.name);

    constructor(
        private readonly jwtService: JwtAuthService,
    ) {
    }
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const authHeader: string = request.headers.authorization;
        if (!authHeader) throw new BadRequestException('Authorization header is required');

        if (!authHeader.includes('Bearer')) throw new BadRequestException('Invalid authorization token1');
        const token = authHeader.split(' ')[1]
        try {
            const payload = this.jwtService.verify(token);
            request.user = payload;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token expired');
            }
            throw new UnauthorizedException('Invalid token');
        }

        return true;
    }
}

