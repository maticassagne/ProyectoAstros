import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { Supplier } from './entities/supplier.entity';
import { Product } from 'src/products/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, Product])],
  controllers: [SuppliersController],
  providers: [SuppliersService],
})
export class SuppliersModule {}
