const request = require("supertest");
const Order = require("../../models/orderModel");
const User = require("../../models/userModel");
const Furniture = require("../../models/furnitureModel");
const {
	OrderSchemaValidator,
} = require("../../middlewares/JoiSchemaValidation");
const validate = require("../../middlewares/JoiSchemaValidation");
const app = require("../../server");

jest.mock("../../middlewares/JoiSchemaValidation");
jest.mock("../../models/userModel");
jest.mock("../../models/furnitureModel");
jest.mock("../../models/orderModel");

describe("Order Controller", () => {
	//get all orders
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("Get all orders", () => {
		it("should return 404 when no orders found", async () => {
			Order.find.mockResolvedValueOnce([]);
			const response = await request(app).get("/api/orders");
			expect(response.status).toBe(404);
			expect(response.body.message).toBe("No orders found!");
		});
	});

	describe("Create Orders", () => {
		it("should return 400 if fields are missing", async () => {
			const response = await request(app)
				.post("/api/orders/create-orders")
				.send({
					userId: "1234567890",
					furnitureId: "",
				});

			expect(response.status).toBe(400);
			expect(response.body.message).toBe("All fields are required!");
		});

		it("it should return 404 if user is not found", async () => {
			User.findById.mockResolvedValueOnce(null);
			const response = await request(app)
				.post("/api/orders/create-orders")
				.send({
					userId: "1234567",
					furnituresId: ["2342", "262625", "24262"],
				});

			expect(response.status).toBe(404);
			expect(response.body.message).toBe("User not found!");
		});
	});

	it("should return 404 if one or more furniture items are not found", async () => {
		Furniture.find.mockResolvedValueOnce([
			{ _id: "2342", category: "Chairs", furnitureType: "Office Chair" },
		]);
		User.findById.mockResolvedValueOnce(true);

		const response = await request(app)
			.post("/api/orders/create-orders")
			.send({
				userId: "1234567",
				furnituresId: ["2342", "262625", "24262"],
			});

		expect(response.status).toBe(404);
		expect(response.body.message).toBe(
			"One or more furniture items not found!"
		);
	});

	it("should return 201 for order successfully created", async () => {
		const mockUser = {
			_id: "12342425",
			name: "user1",
			email: "user1@example.com",
			orders: [],
			save: jest.fn().mockResolvedValue(true),
		};

		User.findById.mockResolvedValueOnce(mockUser);

		Furniture.find.mockResolvedValue([
			{ _id: "25252454", category: "Chair", furnitureType: "Office Chair" },
			{ _id: "452452452", category: "Table", furnitureType: "Dining Table" },
			{ _id: "245245151", category: "Door", furnitureType: "Wooden Door" },
		]);

		const mockOrder = {
			_id: "orderid123",
			userId: "12342425",
			furnituresId: ["25252454", "452452452", "245245151"],
			save: jest.fn().mockResolvedValue(true),
		};

		Order.mockImplementation(() => mockOrder);

		const response = await request(app)
			.post("/api/orders/create-orders")
			.send({
				userId: "12342425",
				furnituresId: ["25252454", "452452452", "245245151"],
			});

		expect(response.status).toBe(201);
		expect(response.body.message).toBe("Order created successfully!");
	});

	describe("Edit Order", () => {
		it("should return 404 if order is not found", async () => {
			Order.findById.mockResolvedValueOnce(null);
			const response = await request(app).put("/api/orders/1234567890");

			expect(response.status).toBe(404);
			expect(response.body.message).toBe("Order not found!");
		});
	});

	it("return 404 when user not found", async () => {
		Order.findById.mockResolvedValueOnce(true);
		User.findById.mockResolvedValueOnce(null);
		const response = await request(app)
			.put("/api/orders/1234567890")
			.send({
				userId: "notExistingUser",
				furnituresId: ["updatedFurnitureId"],
				orderStatus: "Shipped",
			});

		expect(response.status).toBe(404);
		expect(response.body.message).toBe("User not found!");
	});

	it("should return 404 if one or more furniture items are not found", async () => {
		const mockExistingOrder = {
			_id: "1234567890",
			userId: "existingUser",
			furnituresId: ["oldFurniture1", "oldFurniture2"],
			orderStatus: "Pending",
			save: jest.fn().mockResolvedValue(true),
		};

		Order.findById.mockResolvedValueOnce(mockExistingOrder);
		User.findById.mockResolvedValueOnce({ _id: "existingUser" });
		Furniture.find.mockResolvedValueOnce([
			{ _id: "furnitureOne", category: "Chair", furnitureType: "Wooden Chair" },
			{ _id: "furnitureTwo", category: "Table", furnitureType: "Wooden Table" },
		]);

		OrderSchemaValidator.validate.mockReturnValueOnce({ error: null });

		const response = await request(app)
			.put("/api/orders/1234567890")
			.send({
				userId: "existingUser",
				furnituresId: [
					"furnitureOne",
					"furnitureTwo",
					"notExistingFurnitureThree",
				],
				orderStatus: "Shipped",
			});

		expect(response.status).toBe(404);
		expect(response.body.message).toBe(
			"One or more furniture items not found!"
		);
	});

  it('should return 200 if order is successfully created', async ()=>{
    //to be continued.....
  })
});
