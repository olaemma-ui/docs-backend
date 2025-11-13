import { UserRoles } from 'src/user/user.enums';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: UserRoles[]) => import("@nestjs/common").CustomDecorator<string>;
