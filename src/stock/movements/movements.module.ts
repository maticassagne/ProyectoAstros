import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { StockMovement } from './entities/movement.entity';
import { Product } from 'src/products/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockMovement, Product])],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule {}
