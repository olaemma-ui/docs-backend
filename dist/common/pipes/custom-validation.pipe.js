"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomValidationPipe = void 0;
const common_1 = require("@nestjs/common");
class CustomValidationPipe extends common_1.ValidationPipe {
    constructor() {
        super({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            exceptionFactory: (errors) => {
                const formattedErrors = {};
                const flattenErrors = (errs, parentPath = '') => {
                    errs.forEach((err) => {
                        const path = parentPath ? `${parentPath}.${err.property}` : err.property;
                        if (err.constraints) {
                            formattedErrors[path] = Object.values(err.constraints)[0];
                        }
                        if (err.children && err.children.length > 0) {
                            flattenErrors(err.children, path);
                        }
                    });
                };
                flattenErrors(errors);
                return new common_1.BadRequestException({
                    ...formattedErrors,
                    message: 'Validation Failed',
                });
            },
        });
    }
}
exports.CustomValidationPipe = CustomValidationPipe;
//# sourceMappingURL=custom-validation.pipe.js.map