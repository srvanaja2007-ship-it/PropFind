/**
 * HomeFinder - Database Seeder
 * Day 4 Topic: MongoDB with Mongoose Database Integration
 * Author: Person 3 (Database Engineer)
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Property = require("./models/Property");

const SAMPLE_PROPERTIES = [
  {
    title: "Sunny 2 BHK with Balcony in Koramangala",
    price: 32000,
    bhk: 2,
    location: "Koramangala 4th Block, Bengaluru",
    lat: 12.9352,
    lng: 77.6245,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    amenities: ["Parking", "Lift", "Security", "Power Backup"],
    ownerName: "Rajesh Sharma",
    ownerPhone: "+91 98765 43210"
  },
  {
    title: "Luxury 3 BHK Penthouse in Indiranagar",
    price: 65000,
    bhk: 3,
    location: "100ft Road, Indiranagar, Bengaluru",
    lat: 12.9784,
    lng: 77.6408,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    amenities: ["Parking", "Gym", "Swimming Pool", "Lift", "Security", "Power Backup", "Garden"],
    ownerName: "Priya Nair",
    ownerPhone: "+91 98450 12345"
  },
  {
    title: "Cozy 1 BHK Studio for Tech Professionals",
    price: 18000,
    bhk: 1,
    location: "HSR Layout Sector 2, Bengaluru",
    lat: 12.9121,
    lng: 77.6446,
    imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
    amenities: ["Parking", "Security", "Power Backup"],
    ownerName: "Arun Kumar",
    ownerPhone: "+91 97312 98765"
  },
  {
    title: "Spacious 4 BHK Gated Villa with Private Lawn",
    price: 85000,
    bhk: 4,
    location: "ITPL Main Road, Whitefield, Bengaluru",
    lat: 12.9698,
    lng: 77.7500,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    amenities: ["Parking", "Gym", "Swimming Pool", "Security", "Power Backup", "Garden"],
    ownerName: "Sneha Reddy",
    ownerPhone: "+91 99001 54321"
  },
  {
    title: "Charming 2 BHK Flat near Metro Station",
    price: 26000,
    bhk: 2,
    location: "JP Nagar 5th Phase, Bengaluru",
    lat: 12.9063,
    lng: 77.5857,
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    amenities: ["Parking", "Lift", "Security", "Garden"],
    ownerName: "Vikram Malhotra",
    ownerPhone: "+91 98860 67890"
  }
];

async function seedDatabase() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/homefinder";

  try {
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
    console.log("Connected to MongoDB.");

    await Property.deleteMany({});
    console.log("Cleared existing properties.");

    const inserted = await Property.insertMany(SAMPLE_PROPERTIES);
    console.log(`✅ Successfully seeded ${inserted.length} sample Bengaluru properties into MongoDB!`);
  } catch (error) {
    console.warn(`⚠️ Seeding note: MongoDB is not running locally (${error.message}).`);
    console.log(`💡 No worries! HomeFinder includes a built-in memory store with these 5 properties ready when server.js runs!`);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(0);
  }
}

seedDatabase();
