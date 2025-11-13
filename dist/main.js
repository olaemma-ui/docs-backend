"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./core/filters/exception/http.exception.filter");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('dfms/api/v1/');
    const logger = new common_1.Logger();
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter(logger));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: '*',
    });
    await app.listen(process.env.PORT ?? 1000);
}
bootstrap();
//# sourceMappingURL=main.js.map