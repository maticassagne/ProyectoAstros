import { Product } from 'src/products/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum MovementType {
  COMPRA = 'Compra a Proveedor',
  VENTA = 'Venta',
  AJUSTE_POSITIVO = 'Ajuste Manual Positivo',
  AJUSTE_NEGATIVO = 'Ajuste Manual Negativo',
  DEVOLUCION = 'Devolución de Cliente',
}

@Entity({ name: 'stock_movements' })
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: MovementType,
  })
  tipo: MovementType;

  @Column({ type: 'integer' })
  cantidad: number; // Positivo para entradas, negativo para salidas

  @Column({ type: 'text', nullable: true })
  motivo: string; // Para justificar ajustes manuales

  // --- Relación ---
  @ManyToOne(() => Product)
  product: Product;

  @CreateDateColumn({
    name: 'fecha_movimiento',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha: Date;
}
