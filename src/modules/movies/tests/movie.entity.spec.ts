import { Movie } from '../domain/movie.entity';

describe('Movie Entity', () => {
  let movie: Movie;

  beforeEach(() => {
    movie = new Movie(
      1,
      'Test Movie',
      'Test Description',
      'Test Synopsis',
      new Date('2024-01-01'),
      120,
      'PG-13',
      'Test Director',
      ['Actor 1', 'Actor 2'],
      ['Drama', 'Action'],
      'USA',
      'English',
      1,
      true,
      new Date(),
      new Date(),
      8.5,
      'https://example.com/poster.jpg',
      'https://example.com/trailer.mp4',
    );
  });

  describe('static create', () => {
    it('should create a movie with null id', () => {
      const newMovie = Movie.create(
        'New Movie',
        'New Description',
        'New Synopsis',
        new Date('2024-01-01'),
        90,
        'PG',
        'Director',
        ['Actor'],
        ['Comedy'],
        'USA',
        'English',
        1,
        7.5,
        'poster.jpg',
        'trailer.mp4',
      );

      expect(newMovie.id).toBeNull();
      expect(newMovie.title).toBe('New Movie');
      expect(newMovie.duration).toBe(90);
      expect(newMovie.isActive).toBe(true);
    });
  });

  describe('durationFormatted', () => {
    it('should format duration correctly', () => {
      const movie120 = new Movie(
        1,
        'Test',
        'Test',
        'Test',
        new Date(),
        120,
        'PG',
        'Director',
        [],
        [],
        'USA',
        'English',
        1,
      );
      expect(movie120.durationFormatted).toBe('2h 0m');

      const movie95 = new Movie(
        2,
        'Test',
        'Test',
        'Test',
        new Date(),
        95,
        'PG',
        'Director',
        [],
        [],
        'USA',
        'English',
        1,
      );
      expect(movie95.durationFormatted).toBe('1h 35m');

      const movie45 = new Movie(
        3,
        'Test',
        'Test',
        'Test',
        new Date(),
        45,
        'PG',
        'Director',
        [],
        [],
        'USA',
        'English',
        1,
      );
      expect(movie45.durationFormatted).toBe('0h 45m');
    });
  });

  describe('isNew', () => {
    it('should return true for movies released in the last 3 weeks', () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 10); // 10 days ago

      const recentMovie = new Movie(
        1,
        'Recent Movie',
        'Description',
        'Synopsis',
        recentDate,
        120,
        'PG',
        'Director',
        [],
        [],
        'USA',
        'English',
        1,
      );

      expect(recentMovie.isNew()).toBe(true);
      expect(recentMovie.isNewRelease).toBe(true);
    });

    it('should return false for movies released more than 3 weeks ago', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 30); // 30 days ago

      const oldMovie = new Movie(
        1,
        'Old Movie',
        'Description',
        'Synopsis',
        oldDate,
        120,
        'PG',
        'Director',
        [],
        [],
        'USA',
        'English',
        1,
      );

      expect(oldMovie.isNew()).toBe(false);
      expect(oldMovie.isNewRelease).toBe(false);
    });

    it('should handle invalid dates gracefully', () => {
      const invalidMovie = new Movie(
        1,
        'Invalid Movie',
        'Description',
        'Synopsis',
        new Date('invalid'),
        120,
        'PG',
        'Director',
        [],
        [],
        'USA',
        'English',
        1,
      );

      expect(invalidMovie.isNew()).toBe(false);
      expect(invalidMovie.isNewRelease).toBe(false);
    });

    it('should handle string dates', () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 10);

      const movieWithStringDate = new Movie(
        1,
        'String Date Movie',
        'Description',
        'Synopsis',
        recentDate.toISOString() as any, // Simulating string date from DB
        120,
        'PG',
        'Director',
        [],
        [],
        'USA',
        'English',
        1,
      );

      expect(movieWithStringDate.isNew()).toBe(true);
    });
  });

  describe('isClassic', () => {
    it('should return true for movies older than 25 years', () => {
      const oldDate = new Date();
      oldDate.setFullYear(oldDate.getFullYear() - 30); // 30 years ago

      const classicMovie = new Movie(
        1,
        'Classic Movie',
        'Description',
        'Synopsis',
        oldDate,
        120,
        'PG',
        'Director',
        [],
        [],
        'USA',
        'English',
        1,
      );

      expect(classicMovie.isClassic).toBe(true);
    });

    it('should return false for movies newer than 25 years', () => {
      const recentDate = new Date();
      recentDate.setFullYear(recentDate.getFullYear() - 10); // 10 years ago

      const modernMovie = new Movie(
        1,
        'Modern Movie',
        'Description',
        'Synopsis',
        recentDate,
        120,
        'PG',
        'Director',
        [],
        [],
        'USA',
        'English',
        1,
      );

      expect(modernMovie.isClassic).toBe(false);
    });

    it('should handle edge case of exactly 25 years', () => {
      const exactDate = new Date();
      exactDate.setFullYear(exactDate.getFullYear() - 25);

      const edgeMovie = new Movie(
        1,
        'Edge Movie',
        'Description',
        'Synopsis',
        exactDate,
        120,
        'PG',
        'Director',
        [],
        [],
        'USA',
        'English',
        1,
      );

      expect(edgeMovie.isClassic).toBe(true);
    });

    it('should handle invalid dates gracefully', () => {
      const invalidMovie = new Movie(
        1,
        'Invalid Movie',
        'Description',
        'Synopsis',
        new Date('invalid'),
        120,
        'PG',
        'Director',
        [],
        [],
        'USA',
        'English',
        1,
      );

      expect(invalidMovie.isClassic).toBe(false);
    });

    it('should handle string dates', () => {
      const oldDate = new Date();
      oldDate.setFullYear(oldDate.getFullYear() - 30);

      const movieWithStringDate = new Movie(
        1,
        'String Date Classic',
        'Description',
        'Synopsis',
        oldDate.toISOString() as any, // Simulating string date from DB
        120,
        'PG',
        'Director',
        [],
        [],
        'USA',
        'English',
        1,
      );

      expect(movieWithStringDate.isClassic).toBe(true);
    });
  });
});
