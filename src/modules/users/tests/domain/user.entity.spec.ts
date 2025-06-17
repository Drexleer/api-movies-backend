import { User } from '../../domain/user.entity';

describe('User Entity', () => {
  describe('static create', () => {
    it('should create a user with null id', () => {
      const user = User.create(
        'John',
        'Doe',
        'john@example.com',
        'hashedPassword',
        '+1234567890',
        new Date('1990-01-01'),
        'https://example.com/avatar.jpg',
      );

      expect(user.id).toBeNull();
      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.isActive).toBe(true);
    });

    it('should create a user with optional fields as undefined', () => {
      const user = User.create(
        'Jane',
        'Smith',
        'jane@example.com',
        'hashedPassword',
      );

      expect(user.id).toBeNull();
      expect(user.firstName).toBe('Jane');
      expect(user.lastName).toBe('Smith');
      expect(user.phoneNumber).toBeUndefined();
      expect(user.dateOfBirth).toBeUndefined();
      expect(user.avatar).toBeUndefined();
      expect(user.isActive).toBe(true);
    });
  });

  describe('fullName', () => {
    it('should return the full name', () => {
      const user = new User(
        1,
        'John',
        'Doe',
        'john@example.com',
        'hashedPassword',
      );

      expect(user.fullName).toBe('John Doe');
    });

    it('should handle names with spaces', () => {
      const user = new User(
        1,
        'John Carlos',
        'Doe Smith',
        'john@example.com',
        'hashedPassword',
      );

      expect(user.fullName).toBe('John Carlos Doe Smith');
    });
  });

  describe('age', () => {
    it('should return null when dateOfBirth is undefined', () => {
      const user = new User(
        1,
        'John',
        'Doe',
        'john@example.com',
        'hashedPassword',
      );

      expect(user.age).toBeNull();
    });

    it('should calculate age correctly', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25);
      birthDate.setMonth(birthDate.getMonth() - 1); // Make sure birthday has passed

      const user = new User(
        1,
        'John',
        'Doe',
        'john@example.com',
        'hashedPassword',
        '+1234567890',
        birthDate,
      );

      expect(user.age).toBe(25);
    });

    it('should calculate age correctly when birthday has not occurred this year', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25);
      birthDate.setMonth(birthDate.getMonth() + 1); // Make sure birthday hasn\'t occurred

      const user = new User(
        1,
        'John',
        'Doe',
        'john@example.com',
        'hashedPassword',
        '+1234567890',
        birthDate,
      );

      expect(user.age).toBe(24);
    });

    it('should handle edge case of birthday today', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 30);

      const user = new User(
        1,
        'John',
        'Doe',
        'john@example.com',
        'hashedPassword',
        '+1234567890',
        birthDate,
      );

      expect(user.age).toBe(30);
    });

    it('should handle invalid dates gracefully', () => {
      const user = new User(
        1,
        'John',
        'Doe',
        'john@example.com',
        'hashedPassword',
        '+1234567890',
        new Date('invalid'),
      );

      expect(user.age).toBeNull();
    });

    it('should handle string dates from database', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 28);

      const user = new User(
        1,
        'John',
        'Doe',
        'john@example.com',
        'hashedPassword',
        '+1234567890',
        birthDate.toISOString() as any, // Simulating string date from DB
      );

      expect(user.age).toBe(28);
    });

    it('should return null for invalid string dates', () => {
      const user = new User(
        1,
        'John',
        'Doe',
        'john@example.com',
        'hashedPassword',
        '+1234567890',
        'invalid-date' as any,
      );

      expect(user.age).toBeNull();
    });

    it('should handle leap year calculations', () => {
      // Born on leap day
      const leapDate = new Date('1992-02-29');

      const user = new User(
        1,
        'John',
        'Doe',
        'john@example.com',
        'hashedPassword',
        '+1234567890',
        leapDate,
      );

      const currentYear = new Date().getFullYear();
      const expectedAge = currentYear - 1992;

      expect(user.age).toBeGreaterThanOrEqual(expectedAge - 1);
      expect(user.age).toBeLessThanOrEqual(expectedAge);
    });
  });

  describe('constructor', () => {
    it('should create user with all properties', () => {
      const createdAt = new Date('2023-01-01');
      const updatedAt = new Date('2023-01-02');
      const dateOfBirth = new Date('1990-05-15');

      const user = new User(
        1,
        'John',
        'Doe',
        'john@example.com',
        'hashedPassword',
        '+1234567890',
        dateOfBirth,
        'https://example.com/avatar.jpg',
        true,
        createdAt,
        updatedAt,
      );

      expect(user.id).toBe(1);
      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.password).toBe('hashedPassword');
      expect(user.phoneNumber).toBe('+1234567890');
      expect(user.dateOfBirth).toBe(dateOfBirth);
      expect(user.avatar).toBe('https://example.com/avatar.jpg');
      expect(user.isActive).toBe(true);
      expect(user.createdAt).toBe(createdAt);
      expect(user.updatedAt).toBe(updatedAt);
    });

    it('should use default values for optional parameters', () => {
      const user = new User(
        1,
        'John',
        'Doe',
        'john@example.com',
        'hashedPassword',
      );

      expect(user.phoneNumber).toBeUndefined();
      expect(user.dateOfBirth).toBeUndefined();
      expect(user.avatar).toBeUndefined();
      expect(user.isActive).toBe(true);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });
});
