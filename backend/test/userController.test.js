const request = require("supertest");
const app = require("../server");
const { disconnect, connect, clearDatabase } = require("./setup");
require("./setup");
const User = require("../models/userModel");

describe("User case - Login and Sign up", () => {
	beforeAll(connect);
	afterAll(disconnect);
	//sign up case
	describe("User case - Sign up", () => {
		// test if required fields are filled
		it("should throw an error if some of the input fields are missing", async () => {
			const res = await request(app).post("/api/user/signup").send({
				firstname: "",
				lastname: "",
				phoneNumber: "09123456789",
				streetAddress: "123 Main St",
				municipality: "Boac",
				email: "",
				password: "Password@123",
				confirmPassword: "Password@123",
			});

			expect(res.statusCode).toBe(400);
			expect(res.body).toHaveProperty("message", "All fields are required!");
		});

		// test for creating a new user
		it("should create a new user if the user does not exist", async () => {
			const existingUser = await User.findOne({
				email: "charlesvigo@example.com",
			});
			if (existingUser) {
				expect(existingUser).toHaveProperty("email", "charlesvigo@example.com");
			} else {
				const res = await request(app).post("/api/user/signup").send({
					firstname: "Charles",
					lastname: "Vigo",
					phoneNumber: "09123456789",
					streetAddress: "123 Main St",
					municipality: "Boac",
					email: "charlesvigo@example.com",
					password: "Password@123",
					confirmPassword: "Password@123",
				});

				expect(res.statusCode).toBe(201);
				expect(res.body).toHaveProperty(
					"message",
					"Account created successfully!"
				);
			}
		});

		// test if input is not a valid phone number
		it("should return error if phone number is invalid", async () => {
			const res = await request(app).post("/api/user/signup").send({
				firstname: "Charles",
				lastname: "Vigo",
				phoneNumber: "123456789",
				streetAddress: "123 Main St",
				municipality: "Boac",
				email: "charlesvigo123@example.com",
				password: "Password@123",
				confirmPassword: "Password@123",
			});

			expect(res.statusCode).toBe(400);
			expect(res.body).toHaveProperty("message", "Invalid phone number!");
		});

		// test if email is invalid
		it("should return error if email is invalid", async () => {
			const res = await request(app).post("/api/user/signup").send({
				firstname: "Charles",
				lastname: "Vigo",
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

		// test if password don't match
		it("should return error if password don't match", async () => {
			const res = await request(app).post("/api/user/signup").send({
				firstname: "Charles",
				lastname: "Vigo",
				phoneNumber: "09923456788",
				streetAddress: "123 Main St",
				municipality: "Boac",
				email: "charlesvigo123@example.com",
				password: "Password@124",
				confirmPassword: "Password@123",
			});

			expect(res.statusCode).toBe(400);
			expect(res.body).toHaveProperty("message", "Passwords do not match!");
		});
	});

	// Login cases
	describe("User case - Login", () => {
		let user;
		it("should return a success message if login is completed", async () => {
			user = await User.findOne({email:"charlesvigo@example.com"})
			if (user) {
				const res = await request(app).post("/api/user/login").send({
					email: "charlesvigo@example.com",
					password: "Password@123",
				});

				expect(res.statusCode).toBe(200);
				expect(res.body).toHaveProperty("message", "Login successful");
			}
		});

		it("should return error if password is incorrect", async () => {
			user = await User.findOne({email:"charlesvigo@example.com"})
			if (user) {
				const res = await request(app).post("/api/user/login").send({
					email: "charlesvigo@example.com",
					password: "wrongPassword",
				});

				expect(res.statusCode).toBe(400);
				expect(res.body).toHaveProperty("message", "Incorrect password");
			}
		});

		it("should return error if email is incorrect", async () => {
			user = await User.findOne({email:"charlesvigo@example.com"})
			if (user) {
				const res = await request(app).post("/api/user/login").send({
					email: "charlesvigo204@example.com",
					password: "Password@123",
				});

				expect(res.statusCode).toBe(404);
				expect(res.body).toHaveProperty("message", "Incorrect email account");
			}
		});
	});
});
