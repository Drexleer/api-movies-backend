import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CategoryRepositoryInterface } from '../domain/repositories/category.repository.interface';
import { Category } from '../domain/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryResponseDto } from '../dto/category-response.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepository: CategoryRepositoryInterface,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    // Check if category already exists
    const existingCategory = await this.categoryRepository.findByName(
      createCategoryDto.name,
    );

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = Category.create(
      createCategoryDto.name,
      createCategoryDto.description,
    );

    const savedCategory = await this.categoryRepository.create(category);
    return this.toResponseDto(savedCategory);
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.findAll();
    return categories.map((category) => this.toResponseDto(category));
  }

  async findOne(id: number): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.toResponseDto(category);
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    // Check if category exists
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Check if name is being updated and already exists
    if (updateCategoryDto.name) {
      const categoryWithSameName = await this.categoryRepository.findByName(
        updateCategoryDto.name,
      );
      if (categoryWithSameName && categoryWithSameName.id !== id) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    const updatedCategory = await this.categoryRepository.update(
      id,
      updateCategoryDto,
    );

    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.toResponseDto(updatedCategory);
  }

  async remove(id: number): Promise<void> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const deleted = await this.categoryRepository.delete(id);

    if (!deleted) {
      throw new ConflictException('Unable to delete category');
    }
  }

  async getStats(): Promise<{ total: number }> {
    const total = await this.categoryRepository.count();
    return { total };
  }

  private toResponseDto(category: Category): CategoryResponseDto {
    return {
      id: category.id!,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
