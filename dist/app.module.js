"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const folders_module_1 = require("./folders/folders.module");
const files_module_1 = require("./files/files.module");
const permission_module_1 = require("./permission/permission.module");
const audit_module_1 = require("./audit/audit.module");
const notification_module_1 = require("./notification/notification.module");
const team_module_1 = require("./team/team.module");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const commons_module_1 = require("./common/commons.module");
const file_storage_module_1 = require("./file-storage/file-storage.module");
const share_module_1 = require("./share/share.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
            commons_module_1.CommonsModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            folders_module_1.FoldersModule,
            files_module_1.FilesModule,
            permission_module_1.PermissionModule,
            audit_module_1.AuditModule,
            notification_module_1.NotificationModule,
            team_module_1.TeamModule,
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (config) => ({
                    type: 'postgres',
                    host: config.get('TEST_POSTGRES_HOST', 'TESThost'),
                    port: parseInt(config.get('TEST_POSTGRES_PORT', '5432'), 10),
                    username: config.get('TEST_POSTGRES_USER', 'postgres'),
                    password: config.get('TEST_POSTGRES_PASSWORD', ''),
                    database: config.get('TEST_POSTGRES_DB', 'app_db'),
                    entities: [__dirname + '/**/entities/*{.ts,.js}'],
                    synchronize: true,
                    logging: config.get('DB_LOGGING') === 'true',
                    ssl: {
                        rejectUnauthorized: config.get('TEST_DB_SSL') === 'false',
                    },
                }),
            }),
            file_storage_module_1.FileStorageModule,
            share_module_1.ShareModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map