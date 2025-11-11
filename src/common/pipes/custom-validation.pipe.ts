import {
    ValidationPipe,
    ValidationError,
    BadRequestException,
} from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
    constructor() {
        super({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            exceptionFactory: (errors: ValidationError[]) => {
                const formattedErrors: Record<string, string> = {};

                const flattenErrors = (errs: ValidationError[], parentPath = '') => {
                    errs.forEach((err) => {
                        const path = parentPath ? `${parentPath}.${err.property}` : err.property;

                        if (err.constraints) {
                            // Take only the first constraint message per field
                            formattedErrors[path] = Object.values(err.constraints)[0];
                        }

                        if (err.children && err.children.length > 0) {
                            flattenErrors(err.children, path);
                        }
                    });
                };

                flattenErrors(errors);

                // Return flat structure directly
                return new BadRequestException({
                    ...formattedErrors,
                    message: 'Validation Failed',
                });
            },
        });
    }
}