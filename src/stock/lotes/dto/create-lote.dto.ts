import { IsDateString, IsInt, IsUUID, Min } from 'class-validator';

export class CreateLoteDto {
  @IsInt()
  @Min(1)
  cantidad: number;

  @IsDateString()
  fechaVencimiento: string; // Formato 'YYYY-MM-DD'

  @IsUUID()
  productId: string;
}
