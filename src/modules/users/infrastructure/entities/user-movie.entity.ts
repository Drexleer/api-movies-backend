import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Check,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { MovieEntity } from '../../../movies/infrastructure/entities/movie.entity';

@Entity('user_movies')
@Index(['userId'])
@Index(['movieId'])
@Index(['userId', 'movieId'], { unique: true })
@Check('"rating" IS NULL OR ("rating" >= 1 AND "rating" <= 5)')
export class UserMovieEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'user_id',
    type: 'integer',
    nullable: false,
  })
  userId: number;

  @Column({
    name: 'movie_id',
    type: 'integer',
    nullable: false,
  })
  movieId: number;

  @CreateDateColumn({
    name: 'viewed_at',
    type: 'timestamp',
  })
  viewedAt: Date;

  @Column({
    type: 'integer',
    nullable: true,
  })
  rating?: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  review?: string;

  @Column({
    name: 'is_favorite',
    type: 'boolean',
    default: false,
  })
  isFavorite: boolean;

  @Column({
    name: 'watch_time',
    type: 'integer',
    nullable: true,
  })
  watchTime?: number;

  @Column({
    name: 'completed_movie',
    type: 'boolean',
    default: true,
  })
  completedMovie: boolean;

  // Relaciones
  @ManyToOne(() => UserEntity, (user) => user.viewedMovies)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => MovieEntity, (movie) => movie.viewedBy)
  @JoinColumn({ name: 'movie_id' })
  movie: MovieEntity;
}
