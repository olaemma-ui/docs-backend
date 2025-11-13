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
exports.TeamMember = exports.InviteStatus = exports.TeamMemberRole = void 0;
const typeorm_1 = require("typeorm");
const team_entity_1 = require("./team.entity");
const user_entity_1 = require("../../user/entities/user.entity");
var TeamMemberRole;
(function (TeamMemberRole) {
    TeamMemberRole["ADMIN"] = "ADMIN";
    TeamMemberRole["MEMBER"] = "MEMBER";
})(TeamMemberRole || (exports.TeamMemberRole = TeamMemberRole = {}));
var InviteStatus;
(function (InviteStatus) {
    InviteStatus["PENDING"] = "PENDING";
    InviteStatus["ACCEPTED"] = "ACCEPTED";
    InviteStatus["DECLINED"] = "DECLINED";
})(InviteStatus || (exports.InviteStatus = InviteStatus = {}));
let TeamMember = class TeamMember {
    id;
    team;
    user;
    role;
    inviteStatus;
    createdAt;
    updatedAt;
};
exports.TeamMember = TeamMember;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TeamMember.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => team_entity_1.Team, (team) => team.members),
    __metadata("design:type", team_entity_1.Team)
], TeamMember.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], TeamMember.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ enum: TeamMemberRole, default: TeamMemberRole.MEMBER }),
    __metadata("design:type", String)
], TeamMember.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ enum: InviteStatus, default: InviteStatus.PENDING }),
    __metadata("design:type", String)
], TeamMember.prototype, "inviteStatus", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TeamMember.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TeamMember.prototype, "updatedAt", void 0);
exports.TeamMember = TeamMember = __decorate([
    (0, typeorm_1.Entity)('team_members')
], TeamMember);
//# sourceMappingURL=team-member.entity.js.map