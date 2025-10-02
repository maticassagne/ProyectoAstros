import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotesService } from './lotes.service';
import { LotesController } from './lotes.controller';
import { Lote } from './entities/lote.entity';
import { Product } from 'src/products/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lote, Product])],
  controllers: [LotesController],
  providers: [LotesService],
})
export class LotesModule {}
