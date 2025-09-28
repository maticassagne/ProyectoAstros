import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { Supplier } from 'src/stock/suppliers/entities/supplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Supplier])], // <-- Añadimos Category y Supplier
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
