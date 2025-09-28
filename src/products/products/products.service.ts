import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/products/categories/entities/category.entity';
import { Supplier } from 'src/stock/suppliers/entities/supplier.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { categoryId, supplierId, ...productData } = createProductDto;

    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) {
      throw new BadRequestException(
        `La categoría con ID: '${categoryId}' no existe.`,
      );
    }

    const supplier = await this.supplierRepository.findOneBy({
      id: supplierId,
    });
    if (!supplier) {
      throw new BadRequestException(
        `El proveedor con ID: '${supplierId}' no existe.`,
      );
    }

    const newProduct = this.productRepository.create({
      ...productData,
      category,
      supplier,
    });

    return this.productRepository.save(newProduct);
  }

  async findAll() {
    return await this.productRepository.find();
  }

  // ... los métodos findOne, update y remove seguirían un patrón similar ...
}
