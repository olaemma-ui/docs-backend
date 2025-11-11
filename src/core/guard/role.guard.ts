import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User } from "src/user/entities/user.entity";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) return true; // no roles required

        const request = context.switchToHttp().getRequest();
        const user: User = request.user;

        if (!user) throw new ForbiddenException('User not authenticated');

        const hasRole = requiredRoles.includes(user.role as any); // assuming User.role matches UserRoles
        if (!hasRole) throw new ForbiddenException('Insufficient role');

        return true;
    }
}
