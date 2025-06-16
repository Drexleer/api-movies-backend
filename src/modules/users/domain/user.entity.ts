export class User {
  constructor(
    public readonly id: number | null,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly phoneNumber?: string,
    public readonly dateOfBirth?: Date,
    public readonly avatar?: string,
    public readonly isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber?: string,
    dateOfBirth?: Date,
    avatar?: string,
  ): User {
    return new User(
      null, // null indica que aún no tiene ID de la BD
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      dateOfBirth,
      avatar,
      true,
      new Date(),
      new Date(),
    );
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get age(): number | null {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    let age = today.getFullYear() - this.dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < this.dateOfBirth.getDate())
    ) {
      age--;
    }
    return age;
  }
}
