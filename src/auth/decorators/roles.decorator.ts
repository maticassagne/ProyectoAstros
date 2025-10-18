import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from 'src/common/entities/role.entity/role.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolesEnum[]) => SetMetadata(ROLES_KEY, roles);
