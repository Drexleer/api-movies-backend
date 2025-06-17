import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { UserMovieEntity } from '../../../users/infrastructure/entities/user-movie.entity';

@Entity('movies')
@Index(['title'])
@Index(['releaseDate'])
@Index(['categoryId'])
export class MovieEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  synopsis: string;

  @Column({
    name: 'release_date',
    type: 'date',
    nullable: false,
  })
  releaseDate: Date;

  @Column({
    type: 'integer',
    nullable: false,
  })
  duration: number;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  rating: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  director: string;

  @Column({
    type: 'text',
    array: true,
    nullable: false,
  })
  cast: string[];

  @Column({
    type: 'text',
    array: true,
    nullable: false,
  })
  genres: string[];

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  country: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  language: string;

  @Column({
    name: 'category_id',
    type: 'integer',
    nullable: false,
  })
  categoryId: number;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  @Column({
    name: 'imdb_rating',
    type: 'decimal',
    precision: 3,
    scale: 1,
    nullable: true,
  })
  imdbRating?: number;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  poster?: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  trailer?: string;

  // Relaciones
  @ManyToOne(() => CategoryEntity, (category) => category.movies)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @OneToMany(() => UserMovieEntity, (userMovie) => userMovie.movie)
  viewedBy: UserMovieEntity[];

  // Métodos auxiliares (getters que no se persisten)
  get durationFormatted(): string {
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    return `${hours}h ${minutes}m`;
  }

  get isNewRelease(): boolean {
    const threeWeeksAgo = new Date();
    threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
    return this.releaseDate > threeWeeksAgo;
  }

  get isClassic(): boolean {
    const currentYear = new Date().getFullYear();
    const movieYear = this.releaseDate.getFullYear();
    return currentYear - movieYear >= 25;
  }
}
