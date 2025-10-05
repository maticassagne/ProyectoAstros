import { Client } from 'src/sales/clients/entities/client.entity';
// import { User } from 'src/users/entities/user.entity'; // Aún no la creamos, pero la preparamos
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ComprobanteItem } from './comprobante-item.entity';

export enum ComprobanteType {
  PRESUPUESTO = 'Presupuesto',
  VENTA = 'Venta',
  DEVOLUCION = 'Devolución',
}

@Entity({ name: 'comprobantes' })
export class Comprobante {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ComprobanteType })
  tipo: ComprobanteType;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total: number;

  // --- Relaciones ---
  @ManyToOne(() => Client)
  client: Client;

  // @ManyToOne(() => User) // La activaremos cuando creemos Usuarios
  // vendedor: User;

  @OneToMany(() => ComprobanteItem, (item) => item.comprobante, {
    cascade: true,
  })
  items: ComprobanteItem[];

  @CreateDateColumn({ name: 'fecha_emision', type: 'timestamptz' })
  fecha: Date;
}
