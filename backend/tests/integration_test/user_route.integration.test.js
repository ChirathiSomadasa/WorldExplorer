const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const UserModel = require("../../models/User");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Import and mount user routes
const userRoutes = require('../../routes/user_route');
app.use(express.json());
app.use('/api/user', userRoutes);

// Mock environment variables
process.env.JWT_SECRET = "test-secret";

jest.setTimeout(60000);

let mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: "testdb" });

  // Set JWT secret for testing
  process.env.JWT_SECRET = 'test-secret';
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe("User Routes - Integration Tests", () => {
  test("POST /register - Successful registration", async () => {
    const response = await request(app)
      .post("/api/user/register")
      .send({
        first_name: "Chirathi",
        last_name: "Somadasa",
        email: "chirathisomadasa@gmail.com",
        password: "password123",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered successfully");

    const user = await UserModel.findOne({ email: "chirathisomadasa@gmail.com" });
    expect(user).not.toBeNull();
    expect(user.email).toBe("chirathisomadasa@gmail.com");
    expect(user.favorites).toEqual([]);
  });

  test("POST /login - Successful login", async () => {
    // Make sure Chirathi user exists (or update if already exists)
    const existing = await UserModel.findOne({ email: "chirathisomadasa@gmail.com" });
    const hashedPassword = await bcrypt.hash("password123", 10);
    if (!existing) {
      await UserModel.create({
        first_name: "Chirathi",
        last_name: "Somadasa",
        email: "chirathisomadasa@gmail.com",
        password: hashedPassword,
        favorites: [],
      });
    }

    const response = await request(app)
      .post("/api/user/login")
      .send({
        email: "chirathisomadasa@gmail.com",
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.token).toBeDefined();
  });
});
