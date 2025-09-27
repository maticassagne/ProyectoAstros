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

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
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
    const supplier = await this.findOne(id);
    await this.supplierRepository.remove(supplier);
    return {
      message: `Proveedor '${supplier.nombre}' eliminado correctamente.`,
    };
  }
}
