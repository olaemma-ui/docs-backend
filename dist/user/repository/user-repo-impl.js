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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
let UserRepository = class UserRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async create(payload) {
        const user = this.repo.create(payload);
        return this.repo.save(user);
    }
    findById(id) {
        return this.repo.findOneBy({ id });
    }
    findByIds(userIds) {
        return this.repo.find({
            where: {
                id: (0, typeorm_2.In)(userIds),
            },
        });
    }
    findByEmails(emails) {
        return this.repo.find({
            where: {
                email: (0, typeorm_2.In)(emails),
            },
        });
    }
    findOne(filter) {
        const where = filter;
        return this.repo.findOne({ where });
    }
    async find(options) {
        const { page = 1, limit = 10, search, status, role, order, creatorId } = options;
        const skip = (page - 1) * limit;
        const take = limit || 10;
        const where = {};
        if (status)
            where.status = status;
        if (role)
            where.role = role;
        if (creatorId)
            where.creatorId = creatorId;
        const searchCondition = search
            ? [
                { ...where, fullName: (0, typeorm_2.ILike)(`%${search}%`) },
                { ...where, email: (0, typeorm_2.ILike)(`%${search}%`) },
            ]
            : where;
        const [data, total] = await this.repo.findAndCount({
            where: searchCondition,
            order,
            skip,
            take,
        });
        return { data, total, page, limit };
    }
    async count(filter) {
        return filter ? await this.repo.count({ where: filter }) : await this.repo.count();
    }
    async updateById(id, update) {
        const entity = await this.repo.preload({ id, ...update });
        if (!entity)
            throw new common_1.NotFoundException('User not found');
        return this.repo.save(entity);
    }
    findByEmail(email) {
        return this.repo.findOne({ where: { email } });
    }
    async getRoles(id) {
        const user = await this.repo.findOne({ where: { id }, select: ['role'] });
        return user ? [user.role] : [];
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserRepository);
//# sourceMappingURL=user-repo-impl.js.map