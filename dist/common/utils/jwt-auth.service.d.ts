import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from "ms";
export declare class JwtAuthService {
    private readonly jwt;
    private readonly config;
    private readonly secret;
    private readonly expiresIn;
    constructor(jwt: NestJwtService, config: ConfigService);
    sign(payload: Record<string, any>, expiresIn?: StringValue): string;
    verify<T>(token: string): T;
    decode<T>(token: string): T | null;
}
