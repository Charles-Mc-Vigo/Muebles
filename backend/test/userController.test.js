const request = require("supertest");
const app = require("../server");
const { disconnect, connect } = require("./setup");
require("./setup");
const User = require("../models/userModel");

describe("SignUp", () => {
  beforeAll(connect);
  afterAll(disconnect);

  // test if required fields are filled
  it("should throw an error if some of the input fields are missing", async () => {
    const res = await request(app)
      .post("/api/user/signup")
      .send({
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
    expect(res.body).toHaveProperty("message", "All fields are required!");
  });

  // test for creating a new user
  it("should create a new user if the user does not exist", async () => {
    const existingUser = await User.findOne({ email: "john.doe@example.com" });
    if (existingUser) {
      expect(existingUser).toHaveProperty("email", "john.doe@example.com");
    } else {
      const res = await request(app)
        .post("/api/user/signup")
        .send({
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
      expect(res.body).toHaveProperty("message", "Account created successfully!");
    }
  });

    // test to return atleast one user stored
    it("should return all users from the database", async () => {
      const res = await request(app).get("/api/users");
  
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
  
      // use snapshot for the first user in the response
      const user = res.body[0];
      expect(user).toMatchSnapshot();
    });

  // test if input is not a valid phone number
  it("should return error if phone number is invalid", async () => {
    const res = await request(app)
      .post("/api/user/signup")
      .send({
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

  // test if email is invalid
  it("should return error if email is invalid", async () => {
    const res = await request(app)
      .post("/api/user/signup")
      .send({
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

  // test if password don't match
  it("should return error if password don't match", async () => {
    const res = await request(app)
      .post("/api/user/signup")
      .send({
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
