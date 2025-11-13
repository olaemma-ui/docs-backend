import { ConfigService } from '@nestjs/config';
import { HashAlgorithms } from './algorithms.enum';
export declare class HashingService {
    private readonly config;
    private readonly defaultAlgo;
    private readonly bcryptSaltRounds;
    constructor(config: ConfigService);
    hash(value: string, algo?: HashAlgorithms): Promise<string>;
    verify(value: string, expectedHash: string): Promise<boolean>;
}
