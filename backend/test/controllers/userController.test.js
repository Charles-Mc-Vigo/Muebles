//test for usercontroller
const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../../models/userModel");
const {
	UserSchemaValidator,
} = require("../../middlewares/JoiSchemaValidation");
const app = require("../../server");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("validator");
jest.mock("../../models/userModel");
jest.mock("../../middlewares/JoiSchemaValidation");

describe("User Controller", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("SignUp", () => {
		it("should return 400 if any field is missing", async () => {
			const response = await request(app).post("/api/users/signup").send({
				firstname: "John",
				lastname: "Doe",
			});

			expect(response.status).toBe(400);
			expect(response.body.message).toBe("All fields are required!");
		});

		it("should return 400 if email or phone number already exists", async () => {
			User.findOne.mockResolvedValue({ email: "existing@example.com" });

			const response = await request(app).post("/api/users/signup").send({
				firstname: "John",
				lastname: "Doe",
				gender: "Male",
				phoneNumber: "09123456789",
				streetAddress: "123 Main St",
				municipality: "City",
				email: "existing@example.com",
				password: "StrongPass123!",
				confirmPassword: "StrongPass123!",
			});

			expect(response.status).toBe(400);
			expect(response.body.message).toBe(
				"Account or phone number is already existing!"
			);
		});

		it("should return 400 if phone number is invalid", async () => {
			User.findOne.mockResolvedValue(null);
			validator.isMobilePhone.mockReturnValue(false);

			const response = await request(app).post("/api/users/signup").send({
				firstname: "John",
				lastname: "Doe",
				gender: "Male",
				phoneNumber: "invalid-number",
				streetAddress: "123 Main St",
				municipality: "City",
				email: "john@example.com",
				password: "StrongPass123!",
				confirmPassword: "StrongPass123!",
			});

			expect(response.status).toBe(400);
			expect(response.body.message).toBe("Invalid phone number!");
		});

    it('should return 400 if passwords do not match', async () => {
			validator.isMobilePhone.mockReturnValue(true);
      validator.isEmail.mockReturnValue(true)
      validator.isStrongPassword.mockReturnValue(true)
      const response = await request(app).post('/api/users/signup').send({
        firstname: 'John',
        lastname: 'Doe',
        gender: 'Male',
        phoneNumber: '09123456789',
        streetAddress: '123 Main St',
        municipality: 'City',
        email: 'john@example.com',
        password: 'StrongPass123!',
        confirmPassword: 'DifferentPass123!'
      });
    
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Passwords do not match!');
    });

    it('should create a new user and return 201 if all validations pass', async () => {
      // Ensure no existing user is found
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      jwt.sign.mockReturnValue('mockToken');
      UserSchemaValidator.validate.mockReturnValue({ error: null });
      User.prototype.save.mockResolvedValue({
        _id: 'mockUserId',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
      });
    
      const response = await request(app).post('/api/users/signup').send({
        firstname: 'John',
        lastname: 'Doe',
        gender: 'Male',
        phoneNumber: '09123456789',
        streetAddress: '123 Main St',
        municipality: 'City',
        email: 'john@example.com',
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!'
      });
    
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Account created successfully!');
      expect(response.body.token).toBe('mockToken');
    });
  })

	describe("LogIn", () => {
		it("should return 404 if email does not exist", async () => {
			User.findOne.mockResolvedValue(null);

			const response = await request(app).post("/api/users/login").send({
				email: "nonexistent@example.com",
				password: "password123",
			});

			expect(response.status).toBe(404);
			expect(response.body.message).toBe("Incorrect email account!");
		});

		it("should return 400 if password is incorrect", async () => {
			User.findOne.mockResolvedValue({
				email: "john@example.com",
				password: "hashedPassword",
			});
			bcrypt.compare.mockResolvedValue(false);

			const response = await request(app).post("/api/users/login").send({
				email: "john@example.com",
				password: "wrongPassword123",
			});

			expect(response.status).toBe(400);
			expect(response.body.message).toBe("Incorrect password!");
		});

		it("should log in successfully and return 200 if credentials are valid", async () => {
			User.findOne.mockResolvedValue({
				_id: "mockUserId",
				email: "john@example.com",
				password: "hashedPassword",
				isAdmin: false,
			});
			bcrypt.compare.mockResolvedValue(true);
			jwt.sign.mockReturnValue("mockToken");

			const response = await request(app).post("/api/users/login").send({
				email: "john@example.com",
				password: "StrongPass123!",
			});

			expect(response.status).toBe(200);
			expect(response.body.message).toBe("Login successful!");
			expect(response.body.token).toBe("mockToken");
		});
	});
});
