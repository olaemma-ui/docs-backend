import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EncryptionService } from './utils/encryption.service';
import { HashingService } from './utils/hashing.service';
import { JwtAuthService } from './utils/jwt-auth.service';

@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET') || 'changeme',
                // signOptions.expiresIn accepts number | string-like value; cast to any to satisfy types
                signOptions: { expiresIn: (config.get<string>('JWT_EXPIRES_IN') || '1d') as any },
            }),
        }),
    ],
    providers: [EncryptionService, HashingService, JwtAuthService],
    exports: [EncryptionService, HashingService, JwtAuthService],
})
export class CommonsModule { }
