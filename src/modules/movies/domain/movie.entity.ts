export class Movie {
  constructor(
    public readonly id: number | null,
    public readonly title: string,
    public readonly description: string,
    public readonly synopsis: string,
    public readonly releaseDate: Date,
    public readonly duration: number, // en minutos
    public readonly rating: string, // PG, PG-13, R, etc.
    public readonly director: string,
    public readonly cast: string[], // Array de actores principales
    public readonly genres: string[], // Array de géneros adicionales
    public readonly country: string,
    public readonly language: string,
    public readonly categoryId: number,
    public readonly isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly imdbRating?: number, // 1-10
    public readonly poster?: string, // URL de la imagen
    public readonly trailer?: string, // URL del trailer
  ) {}

  static create(
    title: string,
    description: string,
    synopsis: string,
    releaseDate: Date,
    duration: number,
    rating: string,
    director: string,
    cast: string[],
    genres: string[],
    country: string,
    language: string,
    categoryId: number,
    imdbRating?: number,
    poster?: string,
    trailer?: string,
  ): Movie {
    return new Movie(
      null, // null indica que aún no tiene ID de la BD
      title,
      description,
      synopsis,
      releaseDate,
      duration,
      rating,
      director,
      cast,
      genres,
      country,
      language,
      categoryId,
      true,
      new Date(),
      new Date(),
      imdbRating,
      poster,
      trailer,
    );
  }

  isNew(): boolean {
    // Asegurar que releaseDate es un objeto Date válido
    const releaseDate =
      this.releaseDate instanceof Date
        ? this.releaseDate
        : new Date(this.releaseDate);

    // Verificar que la fecha es válida
    if (isNaN(releaseDate.getTime())) return false;

    const threeWeeksAgo = new Date();
    threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
    return releaseDate > threeWeeksAgo;
  }

  get durationFormatted(): string {
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    return `${hours}h ${minutes}m`;
  }

  get isNewRelease(): boolean {
    return this.isNew();
  }

  get isClassic(): boolean {
    // Asegurar que releaseDate es un objeto Date válido
    const releaseDate =
      this.releaseDate instanceof Date
        ? this.releaseDate
        : new Date(this.releaseDate);

    // Verificar que la fecha es válida
    if (isNaN(releaseDate.getTime())) return false;

    const currentYear = new Date().getFullYear();
    const movieYear = releaseDate.getFullYear();
    return currentYear - movieYear >= 25;
  }
}
