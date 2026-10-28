/**
 * HomeFinder - Message / Inquiry Data Model
 * Day 4 Topic: MongoDB Schema & Mongoose Model
 * Author: Person 3 (Database Engineer)
 */
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      required: [true, "Property ID is required"]
    },
    name: {
      type: String,
      required: [true, "Sender name is required"],
      trim: true
    },
    message: {
      type: String,
      required: [true, "Inquiry message content is required"],
      trim: true
    }
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: true }
  }
);

module.exports = mongoose.model("Message", messageSchema);
