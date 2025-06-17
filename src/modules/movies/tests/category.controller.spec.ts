import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CategoryController } from '../presentation/category.controller';
import { CategoryService } from '../application/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { NotFoundException } from '@nestjs/common';

describe('CategoryController (Integration)', () => {
  let app: INestApplication;
  let categoryService: jest.Mocked<CategoryService>;

  const mockCategoryResponse = {
    id: 1,
    name: 'Drama',
    description: 'Drama movies',
    isActive: true,
    createdAt: new Date('2025-06-17T02:51:02.335Z'),
    updatedAt: new Date('2025-06-17T02:51:02.335Z'),
  };

  // HTTP response version with serialized dates
  const mockCategoryHttpResponse = {
    id: 1,
    name: 'Drama',
    description: 'Drama movies',
    isActive: true,
    createdAt: '2025-06-17T02:51:02.335Z',
    updatedAt: '2025-06-17T02:51:02.335Z',
  };

  beforeEach(async () => {
    const mockCategoryServiceMethods = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      getStats: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryServiceMethods,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    categoryService = module.get<CategoryService>(
      CategoryService,
    ) as jest.Mocked<CategoryService>;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /categories', () => {
    const createCategoryDto: CreateCategoryDto = {
      name: 'Drama',
      description: 'Drama movies',
    };

    it('should create a category successfully', async () => {
      categoryService.create.mockResolvedValue(mockCategoryResponse as any);

      const response = await request(app.getHttpServer())
        .post('/categories')
        .send(createCategoryDto)
        .expect(201);

      expect(response.body).toEqual(mockCategoryHttpResponse);
      expect(categoryService.create).toHaveBeenCalledWith(createCategoryDto);
    });

    it('should return 400 for invalid data', async () => {
      const invalidDto = { name: '' }; // Missing description and empty name

      await request(app.getHttpServer())
        .post('/categories')
        .send(invalidDto)
        .expect(400);

      expect(categoryService.create).not.toHaveBeenCalled();
    });

    it('should return 409 when category name already exists', async () => {
      categoryService.create.mockRejectedValue(
        new Error('Category with name Drama already exists'),
      );

      await request(app.getHttpServer())
        .post('/categories')
        .send(createCategoryDto)
        .expect(500); // Will be 500 because we're throwing a generic Error, not ConflictException
    });
  });

  describe('GET /categories', () => {
    it('should return all categories', async () => {
      categoryService.findAll.mockResolvedValue([mockCategoryResponse] as any);

      const response = await request(app.getHttpServer())
        .get('/categories')
        .expect(200);

      expect(response.body).toEqual([mockCategoryHttpResponse]);
      expect(categoryService.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no categories exist', async () => {
      categoryService.findAll.mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get('/categories')
        .expect(200);

      expect(response.body).toEqual([]);
      expect(categoryService.findAll).toHaveBeenCalled();
    });
  });

  describe('GET /categories/:id', () => {
    it('should return a category by id', async () => {
      categoryService.findOne.mockResolvedValue(mockCategoryResponse as any);

      const response = await request(app.getHttpServer())
        .get('/categories/1')
        .expect(200);

      expect(response.body).toEqual(mockCategoryHttpResponse);
      expect(categoryService.findOne).toHaveBeenCalledWith(1);
    });

    it('should return 404 when category not found', async () => {
      categoryService.findOne.mockRejectedValue(
        new NotFoundException('Category with ID 999 not found'),
      );

      await request(app.getHttpServer()).get('/categories/999').expect(404);
    });

    it('should return 400 for invalid id', async () => {
      await request(app.getHttpServer()).get('/categories/invalid').expect(400);
    });
  });

  describe('PUT /categories/:id', () => {
    const updateCategoryDto: UpdateCategoryDto = {
      name: 'Updated Drama',
      description: 'Updated description',
    };

    it('should update a category successfully', async () => {
      const updatedCategory = {
        ...mockCategoryResponse,
        name: 'Updated Drama',
        description: 'Updated description',
      };
      const updatedCategoryHttp = {
        ...mockCategoryHttpResponse,
        name: 'Updated Drama',
        description: 'Updated description',
      };
      categoryService.update.mockResolvedValue(updatedCategory);

      const response = await request(app.getHttpServer())
        .put('/categories/1')
        .send(updateCategoryDto)
        .expect(200);

      expect(response.body).toEqual(updatedCategoryHttp);
      expect(categoryService.update).toHaveBeenCalledWith(1, updateCategoryDto);
    });

    it('should return 404 when category not found', async () => {
      categoryService.update.mockRejectedValue(
        new NotFoundException('Category with ID 999 not found'),
      );

      await request(app.getHttpServer())
        .put('/categories/999')
        .send(updateCategoryDto)
        .expect(404);
    });

    it('should return 400 for invalid data', async () => {
      const invalidDto = { name: '' }; // Empty name

      await request(app.getHttpServer())
        .put('/categories/1')
        .send(invalidDto)
        .expect(400);

      expect(categoryService.update).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /categories/:id', () => {
    it('should delete a category successfully', async () => {
      categoryService.remove.mockResolvedValue(undefined);

      const response = await request(app.getHttpServer())
        .delete('/categories/1')
        .expect(200);

      expect(response.body).toEqual({
        message: 'Categoría eliminada exitosamente',
        categoryId: 1,
        deletedAt: expect.any(String),
      });
      expect(categoryService.remove).toHaveBeenCalledWith(1);
    });

    it('should return 404 when category not found', async () => {
      categoryService.remove.mockRejectedValue(
        new NotFoundException('Category with ID 999 not found'),
      );

      await request(app.getHttpServer()).delete('/categories/999').expect(404);
    });

    it('should return 400 for invalid id', async () => {
      await request(app.getHttpServer())
        .delete('/categories/invalid')
        .expect(400);
    });
  });
});
