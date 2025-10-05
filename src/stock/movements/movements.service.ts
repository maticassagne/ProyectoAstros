import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/products/entities/product.entity';
import { Repository } from 'typeorm';
import { StockMovement } from './entities/movement.entity';

@Injectable()
export class MovementsService {
  constructor(
    @InjectRepository(StockMovement)
    private readonly movementRepository: Repository<StockMovement>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findByProduct(productId: string) {
    // Verificamos que el producto exista
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(
        `Producto con ID '${productId}' no encontrado.`,
      );
    }

    // Buscamos los movimientos y los ordenamos por fecha, del más reciente al más antiguo
    return this.movementRepository.find({
      where: { product: { id: productId } },
      order: { fecha: 'DESC' },
    });
  }
}
