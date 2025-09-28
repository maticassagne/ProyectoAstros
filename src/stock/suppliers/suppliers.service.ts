import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './entities/supplier.entity';
import { Not } from 'typeorm';
import { Product } from 'src/products/products/entities/product.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto) {
    const existingSupplier = await this.supplierRepository.findOne({
      where: [
        { nombre: createSupplierDto.nombre },
        { cuit: createSupplierDto.cuit },
      ],
    });

    if (existingSupplier) {
      throw new ConflictException(
        'Ya existe un proveedor con ese nombre o CUIT.',
      );
    }

    const supplier = this.supplierRepository.create(createSupplierDto);
    return this.supplierRepository.save(supplier);
  }

  async findAll() {
    return await this.supplierRepository.find();
  }

  async findOne(id: string) {
    const supplier = await this.supplierRepository.findOneBy({ id });
    if (!supplier) {
      throw new NotFoundException(`Proveedor con id: '${id}' no encontrado.`);
    }
    return supplier;
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    // Primero, nos aseguramos de que el proveedor que queremos actualizar exista.
    // El método findOne ya lanza un NotFoundException si no lo encuentra.
    const supplierToUpdate = await this.findOne(id);

    // Verificamos si se está intentando cambiar el CUIT
    if (updateSupplierDto.cuit) {
      // Buscamos si existe OTRO proveedor con el mismo CUIT
      const existingSupplier = await this.supplierRepository.findOne({
        where: {
          cuit: updateSupplierDto.cuit,
          id: Not(id), // <-- La magia está aquí
        },
      });

      // Si encontramos otro proveedor, lanzamos el error de conflicto.
      if (existingSupplier) {
        throw new ConflictException(
          `El CUIT: '${updateSupplierDto.cuit}' ya está registrado por otro proveedor.`,
        );
      }
    }

    // Si pasamos las validaciones, actualizamos y guardamos.
    this.supplierRepository.merge(supplierToUpdate, updateSupplierDto);
    return this.supplierRepository.save(supplierToUpdate);
  }

  async remove(id: string) {
    const supplier = await this.supplierRepository.findOne({ where: { id } });
    if (!supplier) throw new NotFoundException('Proveedor no encontrado.');

    // Buscar o crear proveedor por defecto
    let defaultSupplier = await this.supplierRepository.findOne({
      where: { nombre: 'Sin proveedor' },
    });
    if (!defaultSupplier) {
      defaultSupplier = this.supplierRepository.create({
        nombre: 'Sin proveedor',
      });
      await this.supplierRepository.save(defaultSupplier);
    }

    // Reasignar productos que referencian al proveedor que vamos a eliminar
    const products = await this.productRepository.find({
      where: { supplier: { id } },
    });
    for (const p of products) {
      p.supplier = defaultSupplier;
    }
    if (products.length > 0) {
      await this.productRepository.save(products);
    }

    // Finalmente eliminar el proveedor original
    await this.supplierRepository.remove(supplier);

    return {
      message: `Proveedor: '${supplier.nombre}' eliminado. ${products.length} producto(s) reasignado(s) a: '${defaultSupplier.nombre}'.`,
    };
  }
}
