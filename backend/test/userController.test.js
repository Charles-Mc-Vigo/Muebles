const request = require("supertest");
const app = require("../server");
require("./setup");

describe("SignUp", () => {
  it("should create a new user", async () => {
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
        confirmPassword: "Password@123"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("firstname", "John");
    expect(res.body).toHaveProperty("lastname", "Doe");
  });
});

describe("SignUp", () => {
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
        confirmPassword: "Password@123"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid phone number!");
  });
});

describe("SignUp", () => {
  it("should return error if email is invalid", async () => {
    const res = await request(app)
      .post("/api/user/signup")
      .send({
        firstname: "Jane",
        lastname: "Doe",
        phoneNumber: "09123456789",
        streetAddress: "123 Main St",
        municipality: "Boac",
        email: "jane.doe@.com", 
        password: "Password@123",
        confirmPassword: "Password@123"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid email account!");
  });
});