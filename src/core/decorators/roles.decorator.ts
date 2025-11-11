// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/user/user.enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
