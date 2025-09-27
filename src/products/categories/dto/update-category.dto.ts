import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

// PartialType toma todas las validaciones de CreateCategoryDto y las hace opcionales.
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
