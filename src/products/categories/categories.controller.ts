import {
  Controller,
  Get,
  Post,
  Body,
  ParseUUIDPipe,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('products/categories') // Ruta base para este controlador
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post() // Maneja peticiones POST a /products/categories
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get() // Maneja peticiones GET a /products/categories
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id') // GET /products/categories/:id
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id') // PATCH /products/categories/:id
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id') // DELETE /products/categories/:id
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }
}
