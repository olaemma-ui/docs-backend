"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
class Utils {
    static fastRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let s = '';
        for (let i = 0; i < length; i++) {
            s += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return s;
    }
}
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map