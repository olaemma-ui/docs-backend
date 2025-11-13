"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseResponse = void 0;
exports.makeErrorResponse = makeErrorResponse;
class BaseResponse {
    error;
    errorDetails;
    statusCode;
    timestamp;
    path;
    message;
    data;
    meta;
    constructor(init) {
        Object.assign(this, init);
    }
    static makeSuccessResponse(data, meta, message = 'OK', statusCode = 200, path = '/') {
        return new BaseResponse({
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
exports.BaseResponse = BaseResponse;
function makeErrorResponse(statusCode, message, errorDetails = null, path = '/', meta = null) {
    return new BaseResponse({
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
//# sourceMappingURL=base-response.dto.js.map