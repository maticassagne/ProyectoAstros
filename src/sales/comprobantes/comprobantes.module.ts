import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprobantesService } from './comprobantes.service';
import { ComprobantesController } from './comprobantes.controller';
import { Comprobante } from './entities/comprobante.entity';
import { ComprobanteItem } from './entities/comprobante-item.entity';
import { Product } from 'src/products/products/entities/product.entity';
import { Client } from 'src/sales/clients/entities/client.entity';
import { Lote } from 'src/stock/lotes/entities/lote.entity';
import { StockMovement } from 'src/stock/movements/entities/movement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Comprobante,
      ComprobanteItem,
      Product,
      Client,
      Lote,
      StockMovement,
    ]),
  ],
  controllers: [ComprobantesController],
  providers: [ComprobantesService],
})
export class ComprobantesModule {}
