import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { ComprobanteType } from '../entities/comprobante.entity';

class ComprobanteItemDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1)
  cantidad: number;
}

export class CreateComprobanteDto {
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @IsEnum(ComprobanteType)
  @IsOptional()
  tipo: ComprobanteType = ComprobanteType.VENTA;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComprobanteItemDto)
  items: ComprobanteItemDto[];

  @IsUUID()
  @IsOptional() // Opcional, quizás no todas las ventas lo requieran
  vendedorId?: string;
}
