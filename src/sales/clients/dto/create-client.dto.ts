import {
  IsEmail,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { CondicionIva } from '../entities/client.entity';

export class CreateClientDto {
  @IsString()
  @MinLength(3)
  nombre: string;

  @IsOptional()
  @IsNumberString()
  @Length(11, 11, { message: 'El cuit debe tener 11 dígitos' })
  cuit?: string;

  @IsEnum(CondicionIva)
  @IsOptional()
  condicionIva?: CondicionIva;

  @IsEmail()
  @IsOptional()
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
