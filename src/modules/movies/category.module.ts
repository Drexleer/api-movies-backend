import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './infrastructure/entities/category.entity';
import { CategoryRepository } from './infrastructure/repositories/category.repository';
import { CategoryService } from './application/category.service';
import { CategoryController } from './presentation/category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: 'CategoryRepositoryInterface',
      useClass: CategoryRepository,
    },
  ],
  exports: [CategoryService, 'CategoryRepositoryInterface'],
})
export class CategoryModule {}
