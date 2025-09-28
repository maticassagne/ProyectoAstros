import { Category } from 'src/products/categories/entities/category.entity';
import { Supplier } from 'src/stock/suppliers/entities/supplier.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Currency {
  ARS = 'ARS',
  USD = 'USD',
}

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  sku: string;

  @Column({
    name: 'codigo_barras_unidad',
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  codigoBarrasUnidad: string;

  @Column({
    name: 'codigo_barras_bulto',
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  codigoBarrasBulto: string;

  @Column({ name: 'unidades_por_bulto', type: 'integer', default: 1 })
  unidadesPorBulto: number;

  @Column({
    name: 'precio_costo',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  precioCosto: number;

  @Column({
    name: 'moneda_costo',
    type: 'enum',
    enum: Currency,
    default: Currency.ARS,
  })
  monedaCosto: Currency;

  @Column({
    name: 'precio_venta_1',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  precioVenta1: number;

  @Column({
    name: 'precio_venta_2',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  precioVenta2: number;

  @Column({
    name: 'precio_venta_3',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  precioVenta3: number;

  @Column({
    name: 'precio_venta_4',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  precioVenta4: number;

  @Column({
    name: 'precio_venta_5',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  precioVenta5: number;

  @Column({ name: 'stock_minimo', type: 'integer', default: 0 })
  stockMinimo: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category: Category;

  @ManyToOne(() => Supplier, (supplier) => supplier.products, { eager: true })
  supplier: Supplier;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
