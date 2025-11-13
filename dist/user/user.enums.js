"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoles = exports.AccountStatus = void 0;
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["PENDING"] = "PENDING";
    AccountStatus["ACTIVE"] = "ACTIVE";
    AccountStatus["BLACKLIST"] = "BLACKLIST";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
var UserRoles;
(function (UserRoles) {
    UserRoles["USER"] = "USER";
    UserRoles["ADMIN"] = "ADMIN";
    UserRoles["SUPER_ADMIN"] = "SUPER_ADMIN";
})(UserRoles || (exports.UserRoles = UserRoles = {}));
//# sourceMappingURL=user.enums.js.map