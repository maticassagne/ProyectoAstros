import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CondicionIva {
  MONOTRIBUTO = 'Monotributista',
  RESPONSABLE_INSCRIPTO = 'Responsable Inscripto',
  CONSUMIDOR_FINAL = 'Consumidor Final',
  EXENTO = 'Exento',
}

@Entity({ name: 'clients' })
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  nombre: string;

  @Column({ type: 'varchar', length: 13, unique: true, nullable: true })
  cuit: string;

  @Column({
    type: 'enum',
    enum: CondicionIva,
    default: CondicionIva.CONSUMIDOR_FINAL,
  })
  condicionIva: CondicionIva;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  telefono: string;

  @Column({ type: 'varchar', nullable: true })
  domicilio: string;

  @Column({ type: 'varchar', nullable: true })
  localidad: string;

  @Column({ type: 'varchar', nullable: true })
  provincia: string;

  @Column({ name: 'codigo_postal', type: 'varchar', nullable: true })
  codigoPostal: string;

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
