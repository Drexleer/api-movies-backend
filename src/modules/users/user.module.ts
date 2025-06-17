import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { UserEntity } from './infrastructure/entities/user.entity';
import { UserMovieEntity } from './infrastructure/entities/user-movie.entity';

// Repositories
import {
  UserRepository,
  UserMovieRepository,
} from './infrastructure/repositories/user.repository';

// Services
import { UserService } from './application/user.service';

// Controllers
import { UserController } from './presentation/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserMovieEntity])],
  providers: [
    UserService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IUserMovieRepository',
      useClass: UserMovieRepository,
    },
  ],
  controllers: [UserController],
  exports: [UserService, 'IUserRepository', 'IUserMovieRepository'],
})
export class UserModule {}
