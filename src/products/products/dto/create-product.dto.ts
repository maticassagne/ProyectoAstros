import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { Currency } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  precioCosto?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  precioVenta1?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  precioVenta2?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  precioVenta3?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  precioVenta4?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  precioVenta5?: number;

  @IsString()
  @IsOptional()
  codigoBarrasUnidad?: string;

  @IsString()
  @IsOptional()
  codigoBarrasBulto?: string;

  @IsString()
  @IsOptional()
  unidadesPorBulto?: number;

  @IsString()
  @IsOptional()
  monedaCosto?: Currency;

  @IsNumber()
  @IsOptional()
  stockMinimo?: number;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsOptional()
  activo: boolean;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsUUID()
  @IsNotEmpty()
  supplierId: string;
}
