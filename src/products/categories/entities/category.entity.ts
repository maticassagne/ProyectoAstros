// import { Product } from '../../products/entities/product.entity'; // Comentado por ahora
import {
  Column,
  CreateDateColumn,
  Entity,
  // OneToMany, // Comentado por ahora
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  // Relación: Una categoría puede tener muchos productos.
  // La definiremos una vez que la entidad Product exista.
  // @OneToMany(() => Product, (product) => product.category)
  // products: Product[];

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
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
