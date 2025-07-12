require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose");
const logger = require("./logger");

const connectToServer = async () => {
  if (mongoose.connection.readyState === 1) {
    logger.log("DB CONNECTION: Already connected, reusing existing connection.");
    return mongoose.connection.db;
  }

  try {
    await mongoose.connect(process.env.ATLAS_URI);

    logger.log("DB CONNECTION: Successfully connected to MongoDB.");
    return mongoose.connection.db;
  } catch (error) {
    logger.error("DB CONNECTION: Failed to connect to MongoDB", error);
    throw error;
  }
};

const getDb = () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("DB CONNECTION: Not connected to MongoDB!");
}
return mongoose.connection.db;
};

const closeConnection = async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    logger.log("DB CONNECTION: Closed MongoDB connection.");
  }
};

module.exports = { connectToServer, getDb, closeConnection };