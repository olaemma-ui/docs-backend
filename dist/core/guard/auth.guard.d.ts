import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthService } from 'src/common/utils';
export declare class AuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly logger;
    constructor(jwtService: JwtAuthService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
