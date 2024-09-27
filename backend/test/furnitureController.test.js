const request = require('supertest');
const app = require('../server');

// Import models
const Furniture = require('../models/Furniture/furnitureModel');
const Category = require('../models/Furniture/categoryModel');
const FurnitureType = require('../models/Furniture/furnitureTypeModel');
const Materials = require('../models/Furniture/materialsModel');
const Colors = require('../models/Furniture/colorModel');

// Mock models
jest.mock('../models/Furniture/furnitureModel')
jest.mock('../models/Furniture/categoryModel')
jest.mock('../models/Furniture/furnitureTypeModel')
jest.mock('../models/Furniture/materialsModel')
jest.mock('../models/Furniture/colorModel')

// Mock multer
jest.mock('multer', () => {
  return () => ({
    array: () => (req, res, next) => {
      req.files = [{ buffer: Buffer.from('test image') }];
      next();
    }
  });
});

describe('Furniture Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/furnitures', () => {
    it('should return 200 and all furnitures if found', async () => {
      const mockFurnitures = [
        { 
          _id: '1', 
          name: 'Wooden Chair', 
          price: 200,
          category: { name: 'Chairs' },
          furnitureType: { name: 'Chair' },
          material: { name: 'Wood' },
          color: { name: 'Brown' }
        },
        { 
          _id: '2', 
          name: 'Wooden Table', 
          price: 300,
          category: { name: 'Tables' },
          furnitureType: { name: 'Table' },
          material: { name: 'Wood' },
          color: { name: 'Brown' }
        },
      ];

      // Mock the find method and chain it with populate
      const mockPopulate = jest.fn().mockResolvedValue(mockFurnitures);
      const mockFind = jest.fn(() => ({
        populate: mockPopulate
      }));
      
      Furniture.find = mockFind;

      const res = await request(app).get('/api/furnitures');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockFurnitures);
      expect(mockFind).toHaveBeenCalledWith({});
      expect(mockPopulate).toHaveBeenCalledWith([
        { path: "category", select: "name -_id" },
        { path: "furnitureType", select: "name -_id" },
        { path: "material", select: "name -_id" },
        { path: "color", select: "name -_id" },
      ]);
    });
  });
  describe('createFurniture', () => {
    it('should create a new furniture item', async () => {
      const mockCategory = { _id: 'cat1', name: 'Category 1' };
      const mockFurnitureType = { _id: 'type1', name: 'Type 1' };
      const mockMaterial = { _id: 'mat1', name: 'Material 1' };
      const mockColor = { _id: 'col1', name: 'Color 1' };

      Category.findOne.mockResolvedValue(mockCategory);
      FurnitureType.findOne.mockResolvedValue(mockFurnitureType);
      Materials.findOne.mockResolvedValue(mockMaterial);
      Colors.findOne.mockResolvedValue(mockColor);

      const mockNewFurniture = {
        _id: 'newfurniture1',
        name: 'New Furniture',
        category: mockCategory._id,
        furnitureType: mockFurnitureType._id,
        material: mockMaterial._id,
        color: mockColor._id
      };
      Furniture.prototype.save.mockResolvedValue(mockNewFurniture);

      const res = await request(app)
        .post('/api/furnitures')
        .field('category', 'Category 1')
        .field('furnitureType', 'Type 1')
        .field('name', 'New Furniture')
        .field('color', 'Color 1')
        .field('description', 'Test Description')
        .field('stocks', '10')
        .field('material', 'Material 1')
        .field('price', '100')
        .field('size', 'Medium')
        .attach('images', Buffer.from('test image'), 'test.jpg');

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('New furniture is added successfully!');
      expect(res.body.furniture).toEqual(mockNewFurniture);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/furnitures')
        .field('name', 'Incomplete Furniture');

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('The following fields are required:');
    });
  });
});