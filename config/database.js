require("dotenv").config();
const mongoose = require("mongoose");

const cluster = process.env.CLUSTER;

const connectDB = async (logger) => {
  try {
    // trying to connect with database
    await mongoose.connect(
      `mongodb+srv://${cluster}.mongodb.net/login-temp`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    logger.info("Connected to MongoDB");
    console.log("Connected to MongoDB");
  } catch (error) {
    // error
    logger.error("Failed to connect to MongoDB", error);
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

module.exports = connectDB;
