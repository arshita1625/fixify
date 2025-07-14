const request = require("supertest"); //supertest -> client server interactions
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");
const dashboardStatRoute = require("../routes/dashboardStatsRoute");
const database = require("../connect");

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Mock database connection
  database.getDb = jest.fn(() => mongoose.connection.db);

  // Set up Express app with the route
  app = express();
  app.use(express.json());
  app.use("/api", dashboardStatRoute);

  // Seed mock data
  const usersCollection = mongoose.connection.db.collection("users");
  const serviceProvidersCollection = mongoose.connection.db.collection("service_providers");

  await usersCollection.insertMany([
    { _id: new mongoose.Types.ObjectId(), createdAt: new Date(), role: "customer" },
    { _id: new mongoose.Types.ObjectId(), createdAt: new Date(), role: "customer" },
    { _id: new mongoose.Types.ObjectId(), createdAt: new Date(), role: "worker" },
  ]);

  await serviceProvidersCollection.insertMany([
    { _id: new mongoose.Types.ObjectId(), createdAt: new Date(), reviews_count: 5, status: "active" },
    { _id: new mongoose.Types.ObjectId(), createdAt: new Date(), reviews_count: 3, status: "deactivated" },
  ]);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(() => {
  // Mock console.error to suppress error logs during tests
  jest.spyOn(console, "error").mockImplementation(() => { });
});

afterEach(() => {
  // Restore console.error after each test
  jest.restoreAllMocks();
});

test("GET /api/dashboardStats - Success", async () => {
  const response = await request(app).get("/api/dashboardStats");

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("stats");
  expect(response.body.stats).toHaveProperty("totalCustomers");
  expect(response.body.stats).toHaveProperty("totalWorkers");
  expect(response.body.stats).toHaveProperty("totalReviews");
  expect(response.body.stats).toHaveProperty("growthRate");
  expect(response.body).toHaveProperty("chartData");
  expect(response.body).toHaveProperty("recentActivity");
});

test("GET /api/dashboardStats - Database Error", async () => {
  // Mock database connection to throw an error
  database.getDb.mockImplementationOnce(() => {
    throw new Error("Database connection error");
  });

  const response = await request(app).get("/api/dashboardStats");

  expect(response.status).toBe(500);
  expect(response.body).toHaveProperty("message", "Internal Server Error");
});