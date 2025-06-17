import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CategoryService } from '../application/category.service';
import { CategoryResponseDto } from '../dto/category-response.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nueva categoría',
    description: 'Crea una nueva categoría de películas',
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Categoría creada exitosamente',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Ya existe una categoría con ese nombre',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las categorías',
    description: 'Retorna la lista completa de categorías de películas',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de categorías obtenida exitosamente',
    type: [CategoryResponseDto],
  })
  async findAllCategories(): Promise<CategoryResponseDto[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener categoría por ID',
    description: 'Retorna una categoría específica por su ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID de la categoría',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categoría encontrada',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Categoría no encontrada',
  })
  async findOneCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar categoría',
    description: 'Actualiza los datos de una categoría existente',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID de la categoría',
    example: 1,
  })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categoría actualizada exitosamente',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Categoría no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Ya existe una categoría con ese nombre',
  })
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar categoría',
    description: 'Elimina una categoría del sistema',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID de la categoría',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Categoría eliminada exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Categoría no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'No se puede eliminar la categoría (conflicto)',
  })
  async removeCategory(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoryService.remove(id);
  }

  @Get('stats/summary')
  @ApiOperation({
    summary: 'Obtener estadísticas de categorías',
    description: 'Retorna estadísticas básicas sobre las categorías',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estadísticas obtenidas exitosamente',
    schema: {
      type: 'object',
      properties: {
        total: {
          type: 'number',
          description: 'Total de categorías',
          example: 10,
        },
      },
    },
  })
  async getCategoryStats(): Promise<{ total: number }> {
    return this.categoryService.getStats();
  }
}
