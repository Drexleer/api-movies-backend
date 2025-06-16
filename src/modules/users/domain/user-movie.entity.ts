export class UserMovie {
  constructor(
    public readonly id: number | null,
    public readonly userId: number,
    public readonly movieId: number,
    public readonly viewedAt: Date,
    public readonly rating?: number, // 1-5 estrellas del usuario
    public readonly review?: string, // Reseña del usuario
    public readonly isFavorite: boolean = false,
    public readonly watchTime?: number, // Tiempo visto en minutos
    public readonly completedMovie: boolean = true, // Si terminó de ver la película
  ) {}

  static create(
    userId: number,
    movieId: number,
    rating?: number,
    review?: string,
    isFavorite: boolean = false,
    watchTime?: number,
    completedMovie: boolean = true,
  ): UserMovie {
    return new UserMovie(
      null, // null indica que aún no tiene ID de la BD
      userId,
      movieId,
      new Date(),
      rating,
      review,
      isFavorite,
      watchTime,
      completedMovie,
    );
  }

  markAsFavorite(): UserMovie {
    return new UserMovie(
      this.id,
      this.userId,
      this.movieId,
      this.viewedAt,
      this.rating,
      this.review,
      true,
      this.watchTime,
      this.completedMovie,
    );
  }

  addRating(rating: number, review?: string): UserMovie {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    return new UserMovie(
      this.id,
      this.userId,
      this.movieId,
      this.viewedAt,
      rating,
      review || this.review,
      this.isFavorite,
      this.watchTime,
      this.completedMovie,
    );
  }
}
