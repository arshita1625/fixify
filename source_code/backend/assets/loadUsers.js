require("dotenv").config({ path: "./config.env" });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const ServiceProvider = require('../models/serviceProviderModel');
const nodemailer = require("nodemailer");
//data seeding script

async function insertAdminUser() {
    try {
        const hashedPassword = await bcrypt.hash("admin", 10);

        const adminUser = new User({
            username: "admin",
            password: hashedPassword,
            email: "admin",
            phone: "-",
            first_name: "admin_fn",
            last_name: "admin_ln",
            role: "admin",
            isVerified: true,
            address: {
                line1: "-",
                postal_code: "-",
                province: "-",
                country: "-",
                longitude: 0.0,
                latitude: 0.0
            }
        });

        await adminUser.save();
        console.log("Admin user inserted successfully");
    } catch (error) {
        console.error("Error inserting admin user:", error);
        throw error;
    }
}

async function insertServiceProviderUser() {
    try {
        const hashedPassword = await bcrypt.hash("serviceProvider", 10);

        // Create a service provider user
        const user = new User({
            username: "johndoe",
            password: hashedPassword,
            email: "johndoe@gmail.com",
            phone: "1234567890",
            first_name: "John",
            last_name: "Doe",
            role: "provider",
            isVerified: true,
            address: {
                line1: "10 abc street",
                city: "Toronto",
                postal_code: "A1B2C3",
                province: "Ontario",
                country: "Canada",
                longitude: -79.3832,
                latitude: 43.6532
            },
        });
        // Save the user
        await user.save();
        console.log("Service Provider user inserted successfully in User collection");

        // Create a service provider profile
        const serviceProvider = new ServiceProvider({
            status: "verified",
            ratings: 4.2,
            services: ["Plumbing", "Electrical"],
            reviews_count: 10,
            user_id: user._id,
            description: "Experienced service provider with expertise in plumbing and electrical work.",
            hourly_rate: 50,
            availability: {
                Monday: ["9:00 AM - 5:00 PM"],
                Tuesday: ["9:00 AM - 5:00 PM"],
                Wednesday: ["9:00 AM - 5:00 PM"],
                Thursday: ["9:00 AM - 5:00 PM"],
                Friday: ["9:00 AM - 5:00 PM"],
                Saturday: [],
                Sunday: []
            }
        });

        // Save the service provider profile
        await serviceProvider.save();
        console.log("Service Provider user inserted successfully in Service Provider collection");
    } catch (error) {
        console.error("Error inserting Service Provider user:", error);
        throw error;
    }
}

async function insertUnverifiedServiceProviderUser() {
    try {
        const hashedPassword = await bcrypt.hash("serviceProvider", 10);

        // Create a service provider user
        const user = new User({
            username: "jakesmith",
            password: hashedPassword,
            email: "jakesmith@gmail.com",
            phone: "1234567890",
            first_name: "Jake",
            last_name: "Smith",
            role: "provider",
            isVerified: true,
            address: {
                line1: "10 abc street",
                city: "Toronto",
                postal_code: "A1B2C3",
                province: "Ontario",
                country: "Canada",
                longitude: -79.3832,
                latitude: 43.6532
            },
        });
        // Save the user
        await user.save();
        console.log("Service Provider user inserted successfully in User collection");

        // Create a service provider profile
        const serviceProvider = new ServiceProvider({
            status: "pending",
            ratings: 0.0,
            services: ["Plumbing", "Electrical"],
            reviews_count: 0,
            user_id: user._id,
            description: "Experienced service provider with expertise in plumbing and electrical work.",
            hourly_rate: 50,
            availability: {
                Monday: ["9:00 AM - 5:00 PM"],
                Tuesday: ["9:00 AM - 5:00 PM"],
                Wednesday: ["9:00 AM - 5:00 PM"],
                Thursday: ["9:00 AM - 5:00 PM"],
                Friday: ["9:00 AM - 5:00 PM"],
                Saturday: [],
                Sunday: []
            }
        });

        // Save the service provider profile
        await serviceProvider.save();
        console.log("Service Provider user inserted successfully in Service Provider collection");
    } catch (error) {
        console.error("Error inserting Unverified Service Provider user:", error);
        throw error;
    }
}

// async function main() {
//     try {
//         await connectToDatabase();
//         await insertAdminUser();
//     } finally {
//         await mongoose.disconnect();
//     }
// }

// main();

// exports.connectToDatabase = connectToDatabase;
exports.insertAdminUser = insertAdminUser;
exports.insertServiceProviderUser = insertServiceProviderUser;
exports.insertUnverifiedServiceProviderUser = insertUnverifiedServiceProviderUser;