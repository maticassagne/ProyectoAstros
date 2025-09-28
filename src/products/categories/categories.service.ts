import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll() {
    return await this.categoryRepository.find();
  }

  async create(createCategoryDto: CreateCategoryDto) {
    // 1. Buscamos si la categoría ya existe
    const existingCategory = await this.categoryRepository.findOne({
      where: { nombre: createCategoryDto.nombre },
    });

    // 2. Si existe, lanzamos un error de conflicto (HTTP 409)
    if (existingCategory) {
      throw new ConflictException('La categoría ya existe.');
    }

    // 3. Si no existe, la creamos
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      await this.categoryRepository.save(category);
      return category; // Devolvemos la entidad completa, es más estándar
    } catch (error) {
      // Este catch es un seguro por si la base de datos falla por otra razón
      throw new InternalServerErrorException('Error al crear la categoría.');
    }
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Categoría con id: '${id}', no encontrada.`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // findOne ya maneja el error si no se encuentra
    const category = await this.findOne(id);

    // Si se intenta cambiar el nombre a uno que ya existe (y no es el de la categoría actual)
    if (
      updateCategoryDto.nombre &&
      updateCategoryDto.nombre !== category.nombre
    ) {
      const existing = await this.categoryRepository.findOne({
        where: { nombre: updateCategoryDto.nombre },
      });
      if (existing) {
        throw new ConflictException(
          `El nombre de categoría: '${updateCategoryDto.nombre}', ya está en uso.`,
        );
      }
    }
    const updatedCategory = this.categoryRepository.merge(
      category,
      updateCategoryDto,
    );
    return this.categoryRepository.save(updatedCategory);
  }

  async remove(id: string) {
    const category = await this.findOne(id); // verifica existencia

    // Buscar o crear categoría "Sin categoría"
    let defaultCategory = await this.categoryRepository.findOneBy({
      nombre: 'Sin categoría',
    });
    if (!defaultCategory) {
      defaultCategory = this.categoryRepository.create({
        nombre: 'Sin categoría',
      });
      await this.categoryRepository.save(defaultCategory);
    }

    // Reasignar productos
    const products = await this.productRepository.find({
      where: { category: { id } },
    });
    for (const p of products) {
      p.category = defaultCategory;
    }
    if (products.length > 0) {
      await this.productRepository.save(products);
    }

    // Finalmente eliminar la categoría original
    await this.categoryRepository.remove(category);
    return {
      message: `Categoría: '${category.nombre}', eliminada correctamente y ${products.length} producto(s) reasignado(s).`,
    };
  }
}
