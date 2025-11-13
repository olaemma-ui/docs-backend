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
exports.ShareRevokeDTO = void 0;
const class_validator_1 = require("class-validator");
const at_least_one_validator_1 = require("./at-least-one.validator");
let ShareRevokeDTO = class ShareRevokeDTO {
    fileId;
    folderId;
    userIds;
    teamIds;
    reason;
};
exports.ShareRevokeDTO = ShareRevokeDTO;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'fileId must be a valid UUID' }),
    __metadata("design:type", String)
], ShareRevokeDTO.prototype, "fileId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'folderId must be a valid UUID' }),
    __metadata("design:type", String)
], ShareRevokeDTO.prototype, "folderId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'userIds cannot be empty when provided' }),
    (0, class_validator_1.IsUUID)('4', { each: true, message: 'Each userId must be a valid UUID' }),
    __metadata("design:type", Array)
], ShareRevokeDTO.prototype, "userIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'teamIds cannot be empty when provided' }),
    (0, class_validator_1.IsUUID)('4', { each: true, message: 'Each teamId must be a valid UUID' }),
    __metadata("design:type", Array)
], ShareRevokeDTO.prototype, "teamIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShareRevokeDTO.prototype, "reason", void 0);
exports.ShareRevokeDTO = ShareRevokeDTO = __decorate([
    (0, at_least_one_validator_1.AtLeastOne)(['fileId', 'folderId'], { message: 'Provide fileId or folderId to revoke' })
], ShareRevokeDTO);
//# sourceMappingURL=share-revoke.dto.js.map