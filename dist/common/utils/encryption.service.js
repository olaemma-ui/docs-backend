"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const config_1 = require("@nestjs/config");
const algorithms_enum_1 = require("./algorithms.enum");
let EncryptionService = class EncryptionService {
    config;
    algorithm;
    key;
    constructor(config) {
        this.config = config;
        this.algorithm = this.config.get('ENCRYPT_ALGORITHM') || algorithms_enum_1.SymmetricAlgorithms.AES_256_GCM;
        const keyEnv = this.config.get('ENCRYPT_KEY');
        if (!keyEnv) {
            this.key = (0, crypto_1.randomBytes)(32);
        }
        else {
            this.key = Buffer.from(keyEnv, 'base64');
        }
    }
    encrypt(plaintext) {
        const iv = (0, crypto_1.randomBytes)(12);
        const cipher = (0, crypto_1.createCipheriv)(this.algorithm, this.key, iv);
        const encrypted = Buffer.concat([
            cipher.update(Buffer.from(plaintext, 'utf8')),
            cipher.final()
        ]);
        const authTag = cipher.getAuthTag();
        const combined = Buffer.concat([iv, authTag, encrypted]);
        return combined.toString('base64');
    }
    decrypt(combinedBase64) {
        const combined = Buffer.from(combinedBase64, 'base64');
        const iv = combined.subarray(0, 12);
        const authTag = combined.subarray(12, 28);
        const encrypted = combined.subarray(28);
        const decipher = (0, crypto_1.createDecipheriv)(this.algorithm, this.key, iv);
        decipher.setAuthTag(authTag);
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString('utf8');
    }
};
exports.EncryptionService = EncryptionService;
exports.EncryptionService = EncryptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EncryptionService);
//# sourceMappingURL=encryption.service.js.map