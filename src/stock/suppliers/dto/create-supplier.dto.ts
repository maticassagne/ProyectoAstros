import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  @IsNumberString()
  @Length(11, 11, { message: 'El cuit debe tener 11 dígitos' })
  cuit?: string;

  @IsEmail()
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  domicilio?: string;

  @IsString()
  @IsOptional()
  localidad?: string;

  @IsString()
  @IsOptional()
  provincia?: string;

  @IsString()
  @IsOptional()
  codigoPostal?: string;
}
