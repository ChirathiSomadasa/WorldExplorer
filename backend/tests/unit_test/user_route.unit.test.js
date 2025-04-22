const request = require("supertest");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = require("../../routes/user_route"); // Import your user routes
const UserModel = require("../../models/User");

// Mocking dependencies
jest.mock("../../models/User", () => ({
    findOne: jest.fn(),
    create: jest.fn().mockResolvedValue({}), // Ensure `create` is mocked
  }));

  jest.mock("bcrypt", () => ({
    hash: jest.fn(() => Promise.resolve("hashedPassword")),
    compare: jest.fn(() => Promise.resolve(true)),
  }));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mockToken"),
}));

const app = express();
app.use(express.json());
app.use("/api/user", userRouter);

describe("User Routes - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret"; // Set JWT secret for testing
  });

  test("POST /register - Email already in use", async () => {
    UserModel.findOne.mockResolvedValue({ email: "chirathisomadasa@gmail.com" }); // Existing user

    const response = await request(app)
      .post("/api/user/register")
      .send({
        first_name: "Chirathi",
        last_name: "Somadasa",
        email: "chirathisomadasa@gmail.com",
        password: "password123",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Email is already in use");
    expect(UserModel.findOne).toHaveBeenCalledWith({ email: "chirathisomadasa@gmail.com" });
  });

  test("POST /login - Successful login", async () => {
    UserModel.findOne.mockResolvedValue({
      email: "chirathisomadasa@gmail.com",
      password: "hashedPassword",
    });

    const response = await request(app)
      .post("/api/user/login")
      .send({
        email: "chirathisomadasa@gmail.com",
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.token).toBe("mockToken");
    expect(jwt.sign).toHaveBeenCalledWith(
      { email: "chirathisomadasa@gmail.com" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
  });

  test("POST /login - User not found", async () => {
    UserModel.findOne.mockResolvedValue(null); // No user found

    const response = await request(app)
      .post("/api/user/login")
      .send({
        email: "chirathisomadasa@gmail.com",
        password: "password123",
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found");
  });

  test("POST /login - Invalid credentials", async () => {
    UserModel.findOne.mockResolvedValue({
      email: "chirathisomadasa@gmail.com",
      password: "hashedPassword",
    });
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post("/api/user/login")
      .send({
        email: "chirathisomadasa@gmail.com",
        password: "wrongpassword",
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid credentials");
  });
});