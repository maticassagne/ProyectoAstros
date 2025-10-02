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
import { Lote } from 'src/stock/lotes/entities/lote.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(Lote)
    private readonly loteRepository: Repository<Lote>,
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

    const savedProduct = await this.productRepository.save(newProduct);
    // Devolvemos el producto con su stock inicial (que es 0)
    return { ...savedProduct, stock: 0 };
  }

  async findAll() {
    const products = await this.productRepository.find();
    // Usamos Promise.all para procesar todos los productos en paralelo
    const productsWithStock = await Promise.all(
      products.map(async (product) => {
        const stock = await this.calculateStockForProduct(product.id);
        return { ...product, stock };
      }),
    );
    return productsWithStock;
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Producto con ID '${id}' no encontrado.`);
    }
    // Calculamos y añadimos el stock al producto encontrado
    const stock = await this.calculateStockForProduct(id);
    return { ...product, stock };
  }

  private async calculateStockForProduct(productId: string): Promise<number> {
    const lotes = await this.loteRepository.find({
      where: { product: { id: productId } },
    });

    // Sumamos la cantidad de cada lote para obtener el total
    const totalStock = lotes.reduce((sum, lote) => sum + lote.cantidad, 0);
    return totalStock;
  }
  // ... los métodos findOne, update y remove seguirían un patrón similar ...
}
