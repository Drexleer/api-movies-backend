import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CategoryService } from '../../application/category.service';
import { Category } from '../../domain/category.entity';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { UpdateCategoryDto } from '../../dto/update-category.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let mockCategoryRepository: any;

  const mockCategory = new Category(
    1,
    'Drama',
    'Drama movies category',
    true,
    new Date(),
    new Date(),
  );

  beforeEach(async () => {
    mockCategoryRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: 'CategoryRepositoryInterface',
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCategoryDto: CreateCategoryDto = {
      name: 'Action',
      description: 'Action movies category',
    };

    it('should create a category successfully', async () => {
      mockCategoryRepository.findByName.mockResolvedValue(null);
      mockCategoryRepository.create.mockResolvedValue(mockCategory);

      const result = await service.create(createCategoryDto);

      expect(mockCategoryRepository.findByName).toHaveBeenCalledWith('Action');
      expect(mockCategoryRepository.create).toHaveBeenCalled();
      expect(result).toMatchObject({
        id: 1,
        name: 'Drama',
        description: 'Drama movies category',
      });
    });

    it('should throw ConflictException when category name already exists', async () => {
      mockCategoryRepository.findByName.mockResolvedValue(mockCategory);

      await expect(service.create(createCategoryDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockCategoryRepository.findByName).toHaveBeenCalledWith('Action');
      expect(mockCategoryRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      mockCategoryRepository.findAll.mockResolvedValue([mockCategory]);

      const result = await service.findAll();

      expect(mockCategoryRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 1,
        name: 'Drama',
      });
    });

    it('should return empty array when no categories exist', async () => {
      mockCategoryRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(mockCategoryRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a category when found', async () => {
      mockCategoryRepository.findById.mockResolvedValue(mockCategory);

      const result = await service.findOne(1);

      expect(mockCategoryRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toMatchObject({
        id: 1,
        name: 'Drama',
      });
    });

    it('should throw NotFoundException when category does not exist', async () => {
      mockCategoryRepository.findById.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockCategoryRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    const updateCategoryDto: UpdateCategoryDto = {
      name: 'Updated Drama',
      description: 'Updated description',
    };

    it('should update a category successfully', async () => {
      const updatedCategory = {
        ...mockCategory,
        name: 'Updated Drama',
        description: 'Updated description',
      };

      mockCategoryRepository.findById.mockResolvedValue(mockCategory);
      mockCategoryRepository.findByName.mockResolvedValue(null);
      mockCategoryRepository.update.mockResolvedValue(updatedCategory);

      const result = await service.update(1, updateCategoryDto);

      expect(mockCategoryRepository.findById).toHaveBeenCalledWith(1);
      expect(mockCategoryRepository.findByName).toHaveBeenCalledWith(
        'Updated Drama',
      );
      expect(mockCategoryRepository.update).toHaveBeenCalled();
      expect(result.name).toBe('Updated Drama');
    });

    it('should throw NotFoundException when category does not exist', async () => {
      mockCategoryRepository.findById.mockResolvedValue(null);

      await expect(service.update(999, updateCategoryDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCategoryRepository.findById).toHaveBeenCalledWith(999);
      expect(mockCategoryRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when updating to existing name', async () => {
      const anotherCategory = { ...mockCategory, id: 2, name: 'Updated Drama' };

      mockCategoryRepository.findById.mockResolvedValue(mockCategory);
      mockCategoryRepository.findByName.mockResolvedValue(anotherCategory);

      await expect(service.update(1, updateCategoryDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockCategoryRepository.findByName).toHaveBeenCalledWith(
        'Updated Drama',
      );
      expect(mockCategoryRepository.update).not.toHaveBeenCalled();
    });

    it('should allow updating with same name (no change)', async () => {
      const updateWithSameName: UpdateCategoryDto = {
        name: 'Drama', // Same name as current
        description: 'Updated description',
      };

      const updatedCategory = {
        ...mockCategory,
        description: 'Updated description',
      };

      mockCategoryRepository.findById.mockResolvedValue(mockCategory);
      mockCategoryRepository.findByName.mockResolvedValue(mockCategory);
      mockCategoryRepository.update.mockResolvedValue(updatedCategory);

      const result = await service.update(1, updateWithSameName);

      expect(mockCategoryRepository.update).toHaveBeenCalled();
      expect(result.description).toBe('Updated description');
    });
  });

  describe('remove', () => {
    it('should delete a category successfully', async () => {
      mockCategoryRepository.findById.mockResolvedValue(mockCategory);
      mockCategoryRepository.delete.mockResolvedValue(true); // Return true to indicate successful deletion

      await service.remove(1);

      expect(mockCategoryRepository.findById).toHaveBeenCalledWith(1);
      expect(mockCategoryRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when category does not exist', async () => {
      mockCategoryRepository.findById.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockCategoryRepository.findById).toHaveBeenCalledWith(999);
      expect(mockCategoryRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('getStats', () => {
    it('should return category statistics', async () => {
      mockCategoryRepository.count.mockResolvedValue(5);

      const result = await service.getStats();

      expect(mockCategoryRepository.count).toHaveBeenCalled();
      expect(result).toEqual({ total: 5 });
    });

    it('should return zero when no categories exist', async () => {
      mockCategoryRepository.count.mockResolvedValue(0);

      const result = await service.getStats();

      expect(mockCategoryRepository.count).toHaveBeenCalled();
      expect(result).toEqual({ total: 0 });
    });
  });
});
