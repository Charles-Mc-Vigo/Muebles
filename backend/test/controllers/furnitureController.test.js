const request = require('supertest');
const Furniture = require("../../models/furnitureModel");
const { FurnitureSchemaValidator } = require("../../middlewares/JoiSchemaValidation");
const app = require("../../server");

jest.mock("../../middlewares/JoiSchemaValidation");
jest.mock("../../models/furnitureModel");

describe('Furniture Controller',()=>{
  afterEach(() => {
		jest.clearAllMocks();
	});

  describe('Get All Furnitures',()=>{
    it('should return 200 if there are furnitures data found', async()=>{
      const mockFurnitures = [
        {_id:"1234", image:"furniture1.png", category:"Chair", furnitureType:"Wooden Chair",description:"This is a wooden chair", price:200},
        {_id:"5678", image:"furnitur2.png", category:"Cabinet", furnitureType:"Wooden Cabinet",description:"This is a wooden Cabinet", price:500},
        {_id:"9999", image:"furniture3.png", category:"Table", furnitureType:"Wooden Table",description:"This is a wooden Table", price:1000}
      ]

      Furniture.find.mockResolvedValueOnce(mockFurnitures)
      const response = await request(app).get('/api/furnitures')

      // console.log(response.status)
      // console.log(response.body)

      expect(response.status).toBe(200)
      expect(response.body).toStrictEqual(mockFurnitures)
    })

    it('should return 404 if no furniture found', async()=>{
      Furniture.find.mockResolvedValueOnce([])
      const response = await request(app).get('/api/furnitures')
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('No furniture found!')
    })
  })

  describe('Create Furniture',()=>{
    it("should return 201 if furniture is added successfully", async()=>{
      const response = await request(app).post('/api/furnitures/add-furniture').send({
        image:"example.png",
        category:"Door",
        furnitureType:"Wooden Door",
        description:"This is a wooden door",
        price:350
      })

      expect(response.status).toBe(201)
      expect(response.body.message).toBe('New furniture is added successfully!')
    })

    it("should return 400 if no image provided", async()=>{
      const response = await request(app).post('/api/furnitures/add-furniture').send({
        image:null,
        category:"Door",
        furnitureType:"Wooden Door",
        description:"This is a wooden door",
        price:350
      })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe("No image provided!")
    })

    it("should return 400 if some fields are missing", async()=>{
      const response = await request(app).post('/api/furnitures/add-furniture').send({
        image:"example.png",
        category:"Door",
        furnitureType:"Wooden Door",
        description:"This is a wooden door",
        // price:350
      })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe("The following fields are required: price")
    })

    it("should return 400 if multiple fields are missing", async()=>{
      const response = await request(app).post('/api/furnitures/add-furniture').send({
        image:"example.png",
        category:"Door",
        // furnitureType:"Wooden Door",
        description:"This is a wooden door",
        // price:350
      })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe("The following fields are required: furnitureType, price")
    })
  })

  //to be continue
})