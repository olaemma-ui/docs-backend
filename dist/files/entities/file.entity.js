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
exports.FileEntity = void 0;
const typeorm_1 = require("typeorm");
const folder_entity_1 = require("../../folders/entities/folder.entity");
const user_entity_1 = require("../../user/entities/user.entity");
let FileEntity = class FileEntity {
    id;
    name;
    key;
    url;
    size;
    mimeType;
    version;
    versionId;
    folder;
    uploader;
    createdAt;
    updatedAt;
};
exports.FileEntity = FileEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FileEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FileEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FileEntity.prototype, "key", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FileEntity.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], FileEntity.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FileEntity.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], FileEntity.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FileEntity.prototype, "versionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => folder_entity_1.Folder, (folder) => folder.files, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'folder_id', }),
    __metadata("design:type", folder_entity_1.Folder)
], FileEntity.prototype, "folder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'uploader_id', }),
    __metadata("design:type", user_entity_1.User)
], FileEntity.prototype, "uploader", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FileEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FileEntity.prototype, "updatedAt", void 0);
exports.FileEntity = FileEntity = __decorate([
    (0, typeorm_1.Entity)('files')
], FileEntity);
//# sourceMappingURL=file.entity.js.map