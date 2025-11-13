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
exports.InviteVerificationDto = exports.InviteDto = void 0;
const class_validator_1 = require("class-validator");
class InviteDto {
    email;
    fullName;
    roleId;
}
exports.InviteDto = InviteDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Enter a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    __metadata("design:type", String)
], InviteDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Full name is required' }),
    __metadata("design:type", String)
], InviteDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'roleId is required' }),
    __metadata("design:type", String)
], InviteDto.prototype, "roleId", void 0);
class InviteVerificationDto {
    email;
    temporaryPassword;
    password;
}
exports.InviteVerificationDto = InviteVerificationDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Enter a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    __metadata("design:type", String)
], InviteVerificationDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Enter your temporary password' }),
    __metadata("design:type", String)
], InviteVerificationDto.prototype, "temporaryPassword", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Enter your new password' }),
    __metadata("design:type", String)
], InviteVerificationDto.prototype, "password", void 0);
//# sourceMappingURL=invite.dto.js.map