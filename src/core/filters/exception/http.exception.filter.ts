import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

    constructor(
        private readonly logger: Logger
    ) { }

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
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
        const { message, error, statusCode, ...rest } = errorDetails as any;

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
}