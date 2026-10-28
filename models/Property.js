/**
 * HomeFinder - Property Data Model
 * Day 4 Topic: MongoDB Schema & Mongoose Model
 * Author: Person 3 (Database Engineer)
 */
const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Property title is required"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Monthly rent price is required"],
      min: [1, "Price must be greater than zero"]
    },
    bhk: {
      type: Number,
      required: [true, "BHK configuration is required"],
      min: 1,
      max: 4
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true
    },
    lat: {
      type: Number,
      required: [true, "Latitude is required"]
    },
    lng: {
      type: Number,
      required: [true, "Longitude is required"]
    },
    imageUrl: {
      type: String,
      required: [true, "Property image URL is required"]
    },
    amenities: {
      type: [String],
      enum: ["Parking", "Gym", "Swimming Pool", "Lift", "Security", "Power Backup", "Garden"],
      default: []
    },
    ownerName: {
      type: String,
      required: [true, "Owner name is required"],
      trim: true
    },
    ownerPhone: {
      type: String,
      required: [true, "Owner phone number is required"],
      trim: true
    }
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: true }
  }
);

module.exports = mongoose.model("Property", propertySchema);
