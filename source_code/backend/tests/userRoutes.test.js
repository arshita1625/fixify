const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { app } = require("../server");
const loadUsers = require("../assets/loadUsers");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const ServiceProvider = require("../models/serviceProviderModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// Mock Nodemailer
jest.mock("nodemailer");

let mongoServer;

beforeAll(async () => {
    // Override the JWT_SECRET environment variable for testing
    process.env.JWT_SECRET = "4yJv9kL8s5d9f8s7d9f8s7d9f8s7d9f8s7d9f8s7d9f8s7d9f8s7d9f8s7d9f8s7";

    // Mock Nodemailer's createTransport and sendMail
    nodemailer.createTransport.mockReturnValue({
        sendMail: jest.fn().mockResolvedValue({ messageId: "mocked-message-id" }),
    });

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});



let token;
let serviceProviderId;
let userId;

beforeEach(async () => {
    // Load admin user into db
    await loadUsers.insertAdminUser();

    // Load verified service provider user into db
    await loadUsers.insertServiceProviderUser();

    // Load unverified service provider user into db
    await loadUsers.insertUnverifiedServiceProviderUser();

    // Log in as admin to get a token
    const loginResponse = await request(app)
        .post("/users/login")
        .send({ username: "admin", password: "admin" });
    token = loginResponse.body.token;

    // Fetch the service provider and user IDs
    const serviceProvider = await mongoose.connection.db
        .collection("service_providers")
        .findOne({ status: "verified" });
    serviceProviderId = serviceProvider._id;

    const user = await mongoose.connection.db
        .collection("users")
        .findOne({ username: "johndoe" });
    userId = user._id;
});


afterEach(async () => {
    // Clean up the database after each test
    await mongoose.connection.db.collection("users").deleteMany({});
    await mongoose.connection.db.collection("service_providers").deleteMany({});
});

test("Test Admin Successful Login", async () => {
    const response = await request(app)
        .post("/users/login")
        .send({ username: "admin", password: "admin" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Login Successful!");
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
    expect(response.body.user.username).toBe("admin");
    expect(response.body.user.role).toBe("admin");
});

test("Test Admin Unsuccessful Login", async () => {
    const response = await request(app)
        .post("/users/login")
        .send({ username: "admin", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Login Failed! Incorrect Password!");
    expect(response.body.token).toBeUndefined();
    expect(response.body.user).toBeUndefined();
});

test("PUT /users/:id - should update service provider details", async () => {
    const updatedDetails = {
        user_id: userId,
        _id: serviceProviderId,
        userDetails: {
            first_name: "UpdatedFirstName",
            last_name: "UpdatedLastName",
            phone: "9876543210",
        },
        services: ["Plumbing", "Electrical", "Cleaning"],
    };

    const response = await request(app)
        .put(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedDetails);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User updated successfully");

    // Verify the user details were updated
    const updatedUser = await mongoose.connection.db
        .collection("users")
        .findOne({ _id: userId });
    expect(updatedUser.first_name).toBe("UpdatedFirstName");
    expect(updatedUser.last_name).toBe("UpdatedLastName");
    expect(updatedUser.phone).toBe("9876543210");

    // Verify the service provider services were updated
    const updatedServiceProvider = await mongoose.connection.db
        .collection("service_providers")
        .findOne({ _id: serviceProviderId });
    expect(updatedServiceProvider.services).toEqual(["Plumbing", "Electrical", "Cleaning"]);
});

test("PUT /user/:id - should update customer details", async () => {
    const updatedDetails = {
        first_name: "UpdatedCustomerFirstName",
        last_name: "UpdatedCustomerLastName",
        phone: "1231231234",
    };

    const response = await request(app)
        .put(`/user/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedDetails);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User updated successfully");

    // Verify the user details were updated
    const updatedUser = await mongoose.connection.db
        .collection("users")
        .findOne({ _id: userId });
    expect(updatedUser.first_name).toBe("UpdatedCustomerFirstName");
    expect(updatedUser.last_name).toBe("UpdatedCustomerLastName");
    expect(updatedUser.phone).toBe("1231231234");
});

test("PUT /user/:id - should return 404 if user not found", async () => {
    const nonExistentUserId = new mongoose.Types.ObjectId();

    const response = await request(app)
        .put(`/user/${nonExistentUserId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            first_name: "NonExistent",
            last_name: "User",
        });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
});

test("PUT /users/:id - should return 404 if service provider not found", async () => {
    const nonExistentServiceProviderId = new mongoose.Types.ObjectId();

    const response = await request(app)
        .put(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            user_id: userId,
            _id: nonExistentServiceProviderId,
            userDetails: {
                first_name: "NonExistent",
                last_name: "Provider",
            },
            services: ["NonExistentService"],
        });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error updating user");
});

test("PUT /users/update - should update user details", async () => {
    const updatedDetails = {
        email: "johndoe@gmail.com",
        username: "updatedjohndoe",
        name: "UpdatedJohn",
        lastName: "UpdatedDoe",
        phone: "9876543210",
        addressln1: "456 Updated St",
        province: "Ontario",
        postalCode: "B2C3D4",
    };

    const response = await request(app)
        .put("/users/update")
        .send(updatedDetails);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    // Verify the user details were updated
    const updatedUser = await mongoose.connection.db.collection("users").findOne({ email: "johndoe@gmail.com" });
    expect(updatedUser.username).toBe("updatedjohndoe");
    expect(updatedUser.first_name).toBe("UpdatedJohn");
    expect(updatedUser.last_name).toBe("UpdatedDoe");
    expect(updatedUser.phone).toBe("9876543210");
    expect(updatedUser.address.line1).toBe("456 Updated St");
});

test("DELETE /users/:id - should delete a user", async () => {
    const user = await mongoose.connection.db.collection("users").findOne({ username: "johndoe" });

    const response = await request(app)
        .delete(`/users/${user._id}`)
        .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Customer successfully deleted");

    // Verify the user was deleted
    const deletedUser = await mongoose.connection.db.collection("users").findOne({ _id: user._id });
    expect(deletedUser).toBeNull();
});
