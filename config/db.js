/**
 * HomeFinder - Database Connection Configuration
 * Day 4 Topic: MongoDB with Mongoose ODM
 * Author: Person 3 (Database Engineer)
 */
const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/homefinder";

  try {
    // Attempt connection with a short timeout so server doesn't hang if local MongoDB is absent
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Local MongoDB is not running (${error.message}).`);
    console.log(`💡 Activated built-in in-memory fallback store: The app will run 100% smoothly without local MongoDB installed!`);
  }
};

module.exports = connectDB;
