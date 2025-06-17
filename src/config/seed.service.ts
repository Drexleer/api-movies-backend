import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../modules/movies/infrastructure/entities/category.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async seedCategories(): Promise<void> {
    this.logger.log('🌱 Iniciando seed de categorías...');

    const requiredCategories = [
      {
        name: 'Terror',
        description: 'Películas de terror y suspense psicológico',
      },
      {
        name: 'Suspenso',
        description: 'Películas de suspenso y thriller psicológico',
      },
      {
        name: 'Drama',
        description: 'Películas dramáticas que exploran emociones profundas',
      },
      {
        name: 'Comedia',
        description: 'Películas cómicas y de entretenimiento ligero',
      },
    ];

    for (const categoryData of requiredCategories) {
      try {
        // Verificar si la categoría ya existe
        const existingCategory = await this.categoryRepository.findOne({
          where: { name: categoryData.name },
        });

        if (!existingCategory) {
          const category = this.categoryRepository.create({
            name: categoryData.name,
            description: categoryData.description,
          });

          await this.categoryRepository.save(category);
          this.logger.log(`✅ Categoría '${categoryData.name}' creada`);
        } else {
          this.logger.log(`⏭️  Categoría '${categoryData.name}' ya existe`);
        }
      } catch (error) {
        this.logger.error(
          `❌ Error creando categoría '${categoryData.name}':`,
          (error as Error).message,
        );
      }
    }

    this.logger.log('🎉 Seed de categorías completado');
  }

  async runAllSeeds(): Promise<void> {
    this.logger.log('🚀 Ejecutando todos los seeds...');
    await this.seedCategories();
    this.logger.log('✨ Todos los seeds completados');
  }
}
