import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from "ms";

@Injectable()
export class JwtAuthService {
    private readonly secret: string;
    private readonly expiresIn: StringValue;

    constructor(
        private readonly jwt: NestJwtService,
        private readonly config: ConfigService,
    ) {
        this.secret = this.config.get<string>('JWT_SECRET') || 'changeme';
        this.expiresIn = (this.config.get<string>('JWT_EXPIRES_IN') || '1d') as StringValue;
    }

    /**
     * Sign a payload. Optionally override expiresIn for this token.
     */
    sign(payload: Record<string, any>, expiresIn?: StringValue): string {
        const options: JwtSignOptions = {
            secret: this.secret,
            expiresIn: expiresIn || this.expiresIn,
        };

        return this.jwt.sign(payload, options);
    }

    /**
     * Verify a token and return the decoded payload.
     */
    verify<T>(token: string): T {
        return this.jwt.verify(token, { secret: this.secret }) as T;
    }

    /**
     * Decode a token without verifying signature.
     */
    decode<T>(token: string): T | null {
        return this.jwt.decode(token) as T | null;
    }
}
