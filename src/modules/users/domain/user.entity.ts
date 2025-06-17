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

    // Asegurar que dateOfBirth es un objeto Date válido
    const birthDate =
      this.dateOfBirth instanceof Date
        ? this.dateOfBirth
        : new Date(this.dateOfBirth);

    // Verificar que la fecha es válida
    if (isNaN(birthDate.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }
}
