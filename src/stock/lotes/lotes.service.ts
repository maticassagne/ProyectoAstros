import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/products/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateLoteDto } from './dto/create-lote.dto';
import { Lote } from './entities/lote.entity';

@Injectable()
export class LotesService {
  constructor(
    @InjectRepository(Lote)
    private readonly loteRepository: Repository<Lote>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createLoteDto: CreateLoteDto) {
    const { productId, ...loteData } = createLoteDto;

    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new BadRequestException(
        `El producto con ID: '${productId}' no existe.`,
      );
    }

    const newLote = this.loteRepository.create({
      ...loteData,
      product: product,
    });

    return this.loteRepository.save(newLote);
  }

  // Por ahora, un findAll simple. Podríamos filtrarlo por producto más adelante.
  async findAll() {
    return await this.loteRepository.find({ relations: ['product'] });
  }
}
