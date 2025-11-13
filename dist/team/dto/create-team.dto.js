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
exports.CreateTeamDTO = void 0;
const class_validator_1 = require("class-validator");
class CreateTeamDTO {
    name;
    description;
    members;
}
exports.CreateTeamDTO = CreateTeamDTO;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Team name must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Team name is required' }),
    __metadata("design:type", String)
], CreateTeamDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    __metadata("design:type", String)
], CreateTeamDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: 'Members must be an array' }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'At least one Team Member must be provided' }),
    (0, class_validator_1.ArrayUnique)({ message: 'Members email must be unique' }),
    (0, class_validator_1.IsEmail)({}, { each: true, message: 'Each email must be a valid email' }),
    __metadata("design:type", Array)
], CreateTeamDTO.prototype, "members", void 0);
//# sourceMappingURL=create-team.dto.js.map