import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RolesEnum } from 'src/common/entities/role.entity/role.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1. Obtenemos los roles requeridos del decorador @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no se especificaron roles, la ruta es pública para este guard
    if (!requiredRoles) {
      return true;
    }

    // 2. Obtenemos el usuario que fue validado por el JwtAuthGuard
    const { user } = context.switchToHttp().getRequest();

    // 3. Comparamos los roles
    // ¿El rol del usuario está incluido en la lista de roles requeridos?
    return requiredRoles.some((role) => user.role?.nombre === role);
  }
}
