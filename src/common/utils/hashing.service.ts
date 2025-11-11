import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { HashAlgorithms } from './algorithms.enum';

@Injectable()
export class HashingService {
    private readonly defaultAlgo: HashAlgorithms;
    private readonly bcryptSaltRounds: number;

    constructor(private readonly config: ConfigService) {
        this.defaultAlgo = (this.config.get<string>('HASH_ALGORITHM') as HashAlgorithms) || HashAlgorithms.BCRYPT;
        this.bcryptSaltRounds = parseInt(this.config.get<string>('BCRYPT_SALT', '10'), 10) || 10;
    }

    async hash(value: string, algo?: HashAlgorithms): Promise<string> {
        const useAlgo = algo || this.defaultAlgo;
        if (useAlgo === HashAlgorithms.BCRYPT) {
            return bcrypt.hash(value, this.bcryptSaltRounds);
        }
        if (useAlgo === HashAlgorithms.SHA256) {
            const h = createHash(HashAlgorithms.SHA256);
            h.update(value);
            return h.digest('hex');
        }
        throw new Error('Unsupported hash algorithm');
    }

    async verify(value: string, expectedHash: string): Promise<boolean> {
        // Try bcrypt first (safe for bcrypt hashes)
        try {
            const isBcrypt = expectedHash.startsWith('$2');
            if (isBcrypt) {
                return bcrypt.compare(value, expectedHash);
            }
        } catch (e) {}

        // Fallback to sha256 compare
        const sha = createHash(HashAlgorithms.SHA256);
        sha.update(value);
        return sha.digest('hex') === expectedHash;
    }
}
