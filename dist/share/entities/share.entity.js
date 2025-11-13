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
exports.Share = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entities/user.entity");
const file_entity_1 = require("../../files/entities/file.entity");
const folder_entity_1 = require("../../folders/entities/folder.entity");
const share_access_enum_1 = require("../enums/share-access.enum");
const team_entity_1 = require("../../team/entities/team.entity");
let Share = class Share {
    id;
    sharedBy;
    sharedWithUsers;
    sharedWithTeams;
    file;
    folder;
    access;
    note;
    sharedAt;
};
exports.Share = Share;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Share.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    __metadata("design:type", user_entity_1.User)
], Share.prototype, "sharedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Share.prototype, "sharedWithUsers", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => team_entity_1.Team),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Share.prototype, "sharedWithTeams", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => file_entity_1.FileEntity, { nullable: true, eager: true, onDelete: 'CASCADE' }),
    __metadata("design:type", file_entity_1.FileEntity)
], Share.prototype, "file", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => folder_entity_1.Folder, { nullable: true, eager: true, onDelete: 'CASCADE' }),
    __metadata("design:type", folder_entity_1.Folder)
], Share.prototype, "folder", void 0);
__decorate([
    (0, typeorm_1.Column)({ enum: share_access_enum_1.ShareAccess, default: share_access_enum_1.ShareAccess.VIEW }),
    __metadata("design:type", String)
], Share.prototype, "access", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Share.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Share.prototype, "sharedAt", void 0);
exports.Share = Share = __decorate([
    (0, typeorm_1.Entity)('shares'),
    (0, typeorm_1.Unique)(['file', 'folder'])
], Share);
//# sourceMappingURL=share.entity.js.map