export class Category {
  constructor(
    public readonly id: number,
    public readonly name: string,
  ) {}

  static create(name: string): Category {
    return new Category(0, name);
  }
}
