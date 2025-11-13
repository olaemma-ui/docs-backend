import { ExceptionFilter, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger;
    constructor(logger: Logger);
    catch(exception: HttpException, host: ArgumentsHost): void;
}
