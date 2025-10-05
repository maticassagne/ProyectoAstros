import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { MovementsService } from './movements.service';

@Controller('stock/movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Get('history/:productId') // GET /stock/movements/history/<ID_DEL_PRODUCTO>
  findByProduct(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.movementsService.findByProduct(productId);
  }
}
