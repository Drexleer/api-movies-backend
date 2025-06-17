import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { MovieEntity } from './infrastructure/entities/movie.entity';
import { CategoryEntity } from './infrastructure/entities/category.entity';

// Repositories
import { MovieRepository } from './infrastructure/repositories/movie.repository';

// Services
import { MovieService } from './application/movie.service';

// Controllers
import { MovieController } from './presentation/movie.controller';

// Modules
import { CategoryModule } from './category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieEntity, CategoryEntity]),
    CategoryModule,
  ],
  providers: [
    MovieService,
    {
      provide: 'IMovieRepository',
      useClass: MovieRepository,
    },
    {
      provide: 'ICategoryRepository',
      useClass: MovieRepository, // MovieRepository implementa ambas interfaces
    },
  ],
  controllers: [MovieController],
  exports: [MovieService, 'IMovieRepository', 'ICategoryRepository'],
})
export class MovieModule {}
