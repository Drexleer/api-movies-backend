import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { Category } from '../../domain/category.entity';
import { CategoryRepositoryInterface } from '../../domain/repositories/category.repository.interface';

@Injectable()
export class CategoryRepository implements CategoryRepositoryInterface {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      order: { name: 'ASC' },
    });
    return categories.map((category) => this.toDomain(category));
  }

  async findById(id: number): Promise<Category | null> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    return category ? this.toDomain(category) : null;
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await this.categoryRepository.findOne({
      where: { name },
    });
    return category ? this.toDomain(category) : null;
  }

  async create(categoryData: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create({
      name: categoryData.name!,
      description: categoryData.description,
    });
    const savedCategory = await this.categoryRepository.save(category);
    return this.toDomain(savedCategory);
  }

  async update(
    id: number,
    categoryData: Partial<Category>,
  ): Promise<Category | null> {
    const updateResult = await this.categoryRepository.update(id, {
      name: categoryData.name,
      description: categoryData.description,
    });

    if (updateResult.affected === 0) {
      return null;
    }

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const deleteResult = await this.categoryRepository.delete(id);
    return deleteResult.affected ? deleteResult.affected > 0 : false;
  }

  async count(): Promise<number> {
    return this.categoryRepository.count();
  }

  private toDomain(entity: CategoryEntity): Category {
    return new Category(
      entity.id,
      entity.name,
      entity.description,
      true, // isActive - always true for now
      entity.createdAt,
      entity.createdAt, // use createdAt for updatedAt since entity doesn't have updatedAt
    );
  }
}
