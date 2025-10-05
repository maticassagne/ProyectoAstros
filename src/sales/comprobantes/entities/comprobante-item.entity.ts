import { Product } from 'src/products/products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Comprobante } from './comprobante.entity';

@Entity({ name: 'comprobante_items' })
export class ComprobanteItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer' })
  cantidad: number;

  @Column({ name: 'precio_unitario', type: 'decimal', precision: 10, scale: 2 })
  precioUnitario: number; // Guardamos el precio al momento de la venta

  // --- Relaciones ---
  @ManyToOne(() => Comprobante, (comprobante) => comprobante.items)
  comprobante: Comprobante;

  @ManyToOne(() => Product)
  product: Product;
}
