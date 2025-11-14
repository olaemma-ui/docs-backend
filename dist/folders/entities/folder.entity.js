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
exports.Folder = void 0;
const file_entity_1 = require("../../files/entities/file.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
const share_entity_1 = require("../../share/entities/share.entity");
let Folder = class Folder {
    id;
    name;
    owner;
    parent;
    files;
    shares;
    createdAt;
    updatedAt;
};
exports.Folder = Folder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Folder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Folder.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'owner_id' }),
    __metadata("design:type", user_entity_1.User)
], Folder.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Folder, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", Folder)
], Folder.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => file_entity_1.FileEntity, (file) => file.folder, {
        eager: false,
        cascade: true,
        lazy: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        orphanedRowAction: 'delete',
    }),
    __metadata("design:type", Promise)
], Folder.prototype, "files", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => share_entity_1.Share, (share) => share.folder, {
        cascade: true,
        eager: false,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], Folder.prototype, "shares", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ nullable: false }),
    __metadata("design:type", Date)
], Folder.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Folder.prototype, "updatedAt", void 0);
exports.Folder = Folder = __decorate([
    (0, typeorm_1.Entity)('folders')
], Folder);
//# sourceMappingURL=folder.entity.js.map