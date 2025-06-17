import { Category } from '../category.entity';

export interface CategoryRepositoryInterface {
  findAll(): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  create(categoryData: Partial<Category>): Promise<Category>;
  update(id: number, categoryData: Partial<Category>): Promise<Category | null>;
  delete(id: number): Promise<boolean>;
  count(): Promise<number>;
}
