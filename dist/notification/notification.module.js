"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("./notification.service");
const notification_controller_1 = require("./notification.controller");
const config_1 = require("@nestjs/config");
const mailer_1 = require("@nestjs-modules/mailer");
const path_1 = require("path");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = __decorate([
    (0, common_1.Module)({
        controllers: [notification_controller_1.NotificationController],
        providers: [notification_service_1.NotificationService],
        exports: [notification_service_1.NotificationService],
        imports: [config_1.ConfigModule, mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (config) => {
                    const port = Number(config.get('SMTP_PORT'));
                    const isSecure = port === 465;
                    return {
                        transport: {
                            host: config.get('SMTP_HOST'),
                            port: port,
                            secure: isSecure,
                            auth: {
                                user: config.get('SMTP_USER'),
                                pass: config.get('SMTP_PASS'),
                            },
                            connectionTimeout: 30000,
                            greetingTimeout: 15000,
                            socketTimeout: 30000,
                            logger: true,
                            debug: true,
                        },
                        defaults: {
                            from: `"BertAndre" <${config.get('SMTP_USER')}>`,
                        },
                        template: {
                            dir: (0, path_1.join)(process.cwd(), 'src', 'notification', 'templates'),
                            adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                            options: {
                                strict: true,
                            },
                        },
                    };
                }
            }),]
    })
], NotificationModule);
//# sourceMappingURL=notification.module.js.map