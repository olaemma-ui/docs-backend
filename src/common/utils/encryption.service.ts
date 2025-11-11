import { Injectable } from '@nestjs/common';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { SymmetricAlgorithms } from './algorithms.enum';

@Injectable()
export class EncryptionService {
    private readonly algorithm: SymmetricAlgorithms;
    private readonly key: Buffer;

    constructor(private readonly config: ConfigService) {
        this.algorithm = (this.config.get<string>('ENCRYPT_ALGORITHM') as SymmetricAlgorithms) || SymmetricAlgorithms.AES_256_GCM;
        const keyEnv = this.config.get<string>('ENCRYPT_KEY');
        if (!keyEnv) {
            // generate a random key in memory if not provided (not recommended for production)
            this.key = randomBytes(32);
        } else {
            this.key = Buffer.from(keyEnv, 'base64');
        }
    }

    encrypt(plaintext: string): string {
        const iv = randomBytes(12);
        const cipher = createCipheriv(this.algorithm, this.key, iv);
        const encrypted = Buffer.concat([
            cipher.update(Buffer.from(plaintext, 'utf8')),
            cipher.final()
        ]);
        const authTag = cipher.getAuthTag();

        // Concatenate: IV (12 bytes) + AuthTag (16 bytes) + Encrypted Data
        const combined = Buffer.concat([iv, authTag, encrypted]);
        return combined.toString('base64');
    }

    decrypt(combinedBase64: string): string {
        const combined = Buffer.from(combinedBase64, 'base64');

        // Extract parts by byte position
        const iv = combined.subarray(0, 12);
        const authTag = combined.subarray(12, 28);
        const encrypted = combined.subarray(28);

        const decipher = createDecipheriv(this.algorithm, this.key, iv);
        decipher.setAuthTag(authTag);
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

        return decrypted.toString('utf8');
    }
}
