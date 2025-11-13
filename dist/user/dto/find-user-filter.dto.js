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
exports.FindUsersFilterOptions = void 0;
const class_validator_1 = require("class-validator");
const user_enums_1 = require("../user.enums");
class FindUsersFilterOptions {
    page;
    limit;
    search;
    creatorId;
    status;
    role;
    order;
}
exports.FindUsersFilterOptions = FindUsersFilterOptions;
__decorate([
    (0, class_validator_1.Min)(1, { message: "Page starts from 1" }),
    __metadata("design:type", Number)
], FindUsersFilterOptions.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.Min)(1, { message: "Page limits starts from 1" }),
    __metadata("design:type", Number)
], FindUsersFilterOptions.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "Enter a valid search string" }),
    __metadata("design:type", String)
], FindUsersFilterOptions.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'CreatorID must be UUID' }),
    __metadata("design:type", String)
], FindUsersFilterOptions.prototype, "creatorId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindUsersFilterOptions.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindUsersFilterOptions.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)('ASC | DESC'),
    __metadata("design:type", Object)
], FindUsersFilterOptions.prototype, "order", void 0);
//# sourceMappingURL=find-user-filter.dto.js.map