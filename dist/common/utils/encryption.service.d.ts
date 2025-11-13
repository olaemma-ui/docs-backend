import { ConfigService } from '@nestjs/config';
export declare class EncryptionService {
    private readonly config;
    private readonly algorithm;
    private readonly key;
    constructor(config: ConfigService);
    encrypt(plaintext: string): string;
    decrypt(combinedBase64: string): string;
}
