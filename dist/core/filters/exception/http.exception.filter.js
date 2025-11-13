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
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        this.logger.error(`
        Request URL: ${request.originalUrl} \n
        Request Method: ${request.method} \n
        Request Headers: ${JSON.stringify(request.headers)} \n
        Request Body: ${JSON.stringify(request.body)} \n
        Request IP: ${request.ip} \n
        Status: ${status} \n
        HTTP Exception: ${exception.message} \n
        Stack Trace: ${exception.stack} \n
    `);
        const errorDetails = exception.getResponse();
        const { message, error, statusCode, ...rest } = errorDetails;
        response.status(status).json({
            error: true,
            errorDetails: rest,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.message,
            data: null,
        });
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException),
    __metadata("design:paramtypes", [common_1.Logger])
], HttpExceptionFilter);
//# sourceMappingURL=http.exception.filter.js.map