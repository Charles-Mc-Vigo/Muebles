const request = require("supertest");
const app = require("../server");
const { disconnect, connect } = require("./setup");
require("./setup");

describe("SignUp", () => {

  beforeAll(connect);
  afterAll(disconnect)

  //test for creating a new user
	it("should create a new user", async () => {
		const res = await request(app).post("/api/user/signup").send({
			firstname: "John",
			lastname: "Doe",
			phoneNumber: "09123456789",
			streetAddress: "123 Main St",
			municipality: "Boac",
			email: "john.doe@example.com",
			password: "Password@123",
			confirmPassword: "Password@123",
		});

		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty("_id");
		expect(res.body).toHaveProperty("firstname", "John");
		expect(res.body).toHaveProperty("lastname", "Doe");
	});

  it("should throw an error if some of the input fields are missing", async () => {
		const res = await request(app).post("/api/user/signup").send({
			firstname: "",
			lastname: "Doe",
			phoneNumber: "09123456789",
			streetAddress: "123 Main St",
			municipality: "Boac",
			email: "",
			password: "Password@123",
			confirmPassword: "Password@123",
		});

		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty("message","All fields are required!");
	});

	it("should return error if phone number is invalid", async () => {
		const res = await request(app).post("/api/user/signup").send({
			firstname: "Jane",
			lastname: "Doe",
			phoneNumber: "123456789",
			streetAddress: "123 Main St",
			municipality: "Boac",
			email: "jane.doe@example.com",
			password: "Password@123",
			confirmPassword: "Password@123",
		});

		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty("message", "Invalid phone number!");
	});

	it("should return error if email is invalid", async () => {
		const res = await request(app).post("/api/user/signup").send({
			firstname: "Jane",
			lastname: "Doe",
			phoneNumber: "09123456788",
			streetAddress: "123 Main St",
			municipality: "Boac",
			email: "invalid-email",
			password: "Password@123",
			confirmPassword: "Password@123",
		});

		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty("message", "Invalid email account!");
	});

  it("should return error if password dont match", async () => {
		const res = await request(app).post("/api/user/signup").send({
			firstname: "Jane",
			lastname: "Doe",
			phoneNumber: "09123456788",
			streetAddress: "123 Main St",
			municipality: "Boac",
			email: "jane.doe@example.com",
			password: "Password@124",
			confirmPassword: "Password@123",
		});

		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty("message", "Passwords do not match!");
	});
});
