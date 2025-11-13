export declare class BaseResponse<T> {
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
    } | null;
    constructor(init: Partial<BaseResponse<T>>);
    static makeSuccessResponse<T>(data: T, meta?: {
        total: number;
        currentPage: number;
        totalPages: number;
    } | null, message?: string, statusCode?: number, path?: string): BaseResponse<T>;
}
export declare function makeErrorResponse(statusCode: number, message: string, errorDetails?: any, path?: string, meta?: null): BaseResponse<null>;
