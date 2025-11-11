/**
 * Standard API response shape used across the application.
 * Matches the format emitted by `HttpExceptionFilter` for error responses.
 */
export class BaseResponse<T> {
    error: boolean;
    errorDetails?: any;
    statusCode: number;
    timestamp: string;
    path: string;
    message: string;
    data: T | null;
    meta?: {
        total: number;
        currentPage: number;
        totalPages: number;
    } | null

    constructor(init: Partial<BaseResponse<T>>) {
        Object.assign(this, init);
    }

    /**
     * Helper to build a success response matching the BaseResponse shape.
     */
    static makeSuccessResponse<T>(
        data: T,
        meta?: {
            total: number;
            currentPage: number;
            totalPages: number;
        } | null ,
        message = 'OK', statusCode = 200, path = '/',): BaseResponse<T> {
        return new BaseResponse<T>({
            error: false,
            errorDetails: null,
            statusCode,
            timestamp: new Date().toISOString(),
            path,
            message,
            data,
            meta,
        });
    }
}

/**
 * Helper to build an error response matching the BaseResponse shape.
 */
export function makeErrorResponse(statusCode: number, message: string, errorDetails: any = null, path = '/', meta = null): BaseResponse<null> {
    return new BaseResponse<null>({
        error: true,
        errorDetails,
        statusCode,
        timestamp: new Date().toISOString(),
        path,
        message,
        data: null,
        meta: null
    });
}
