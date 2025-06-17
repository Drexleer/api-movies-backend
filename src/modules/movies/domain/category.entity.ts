export class Category {
  constructor(
    public readonly id: number | null,
    public readonly name: string,
    public readonly description?: string,
    public readonly isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(name: string, description?: string): Category {
    return new Category(null, name, description);
  }

  get displayName(): string {
    return this.name;
  }
}
