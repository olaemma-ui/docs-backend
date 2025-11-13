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
exports.ShareCreateDTO = void 0;
const class_validator_1 = require("class-validator");
const share_access_enum_1 = require("../enums/share-access.enum");
const at_least_one_validator_1 = require("./at-least-one.validator");
let ShareCreateDTO = class ShareCreateDTO {
    fileId;
    folderId;
    emails;
    teamIds;
    access;
    note;
};
exports.ShareCreateDTO = ShareCreateDTO;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'fileId must be a valid UUID' }),
    __metadata("design:type", String)
], ShareCreateDTO.prototype, "fileId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'folderId must be a valid UUID' }),
    __metadata("design:type", String)
], ShareCreateDTO.prototype, "folderId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEmail)({}, { each: true, message: 'Each email must be a valid email address' }),
    __metadata("design:type", Array)
], ShareCreateDTO.prototype, "emails", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true, message: 'Each teamId must be a valid UUID' }),
    __metadata("design:type", Array)
], ShareCreateDTO.prototype, "teamIds", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(share_access_enum_1.ShareAccess, { message: 'access must be one of VIEW, EDIT, OWNER' }),
    __metadata("design:type", String)
], ShareCreateDTO.prototype, "access", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShareCreateDTO.prototype, "note", void 0);
exports.ShareCreateDTO = ShareCreateDTO = __decorate([
    (0, at_least_one_validator_1.AtLeastOne)(['fileId', 'folderId'], { message: 'Provide either fileId or folderId' }),
    (0, at_least_one_validator_1.AtLeastOne)(['emails', 'teamIds'], { message: 'Provide at least one recipient (emails or teamIds)' })
], ShareCreateDTO);
//# sourceMappingURL=share-create.dto.js.map