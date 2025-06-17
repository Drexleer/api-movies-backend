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
  ],
  controllers: [MovieController],
  exports: [MovieService, 'IMovieRepository'],
})
export class MovieModule {}
