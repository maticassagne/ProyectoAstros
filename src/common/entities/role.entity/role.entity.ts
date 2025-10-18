import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum RolesEnum {
  ADMIN = 'Admin',
  VENDEDOR = 'Vendedor',
  CLIENTE = 'Cliente',
}

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: RolesEnum; // 'Admin', 'Vendedor', 'Cliente', etc.

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
