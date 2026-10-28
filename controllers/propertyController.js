/**
 * HomeFinder - Property Controller
 * Day 3 Topic: Node.js, Express & REST API Business Logic
 * Author: Person 2 (Backend Developer)
 */
const mongoose = require("mongoose");
const Property = require("../models/Property");

// Built-in in-memory fallback dataset (Active when local MongoDB is offline)
let memoryProperties = [
  {
    _id: "671fb100e4b01a2b3c4d5e01",
    title: "Sunny 2 BHK with Balcony in Koramangala",
    price: 32000,
    bhk: 2,
    location: "Koramangala 4th Block, Bengaluru",
    lat: 12.9352,
    lng: 77.6245,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    amenities: ["Parking", "Lift", "Security", "Power Backup"],
    ownerName: "Rajesh Sharma",
    ownerPhone: "+91 98765 43210",
    createdAt: new Date("2026-10-15").toISOString()
  },
  {
    _id: "671fb100e4b01a2b3c4d5e02",
    title: "Luxury 3 BHK Penthouse in Indiranagar",
    price: 65000,
    bhk: 3,
    location: "100ft Road, Indiranagar, Bengaluru",
    lat: 12.9784,
    lng: 77.6408,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    amenities: ["Parking", "Gym", "Swimming Pool", "Lift", "Security", "Power Backup", "Garden"],
    ownerName: "Priya Nair",
    ownerPhone: "+91 98450 12345",
    createdAt: new Date("2026-10-18").toISOString()
  },
  {
    _id: "671fb100e4b01a2b3c4d5e03",
    title: "Cozy 1 BHK Studio for Tech Professionals",
    price: 18000,
    bhk: 1,
    location: "HSR Layout Sector 2, Bengaluru",
    lat: 12.9121,
    lng: 77.6446,
    imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
    amenities: ["Parking", "Security", "Power Backup"],
    ownerName: "Arun Kumar",
    ownerPhone: "+91 97312 98765",
    createdAt: new Date("2026-10-20").toISOString()
  },
  {
    _id: "671fb100e4b01a2b3c4d5e04",
    title: "Spacious 4 BHK Gated Villa with Private Lawn",
    price: 85000,
    bhk: 4,
    location: "ITPL Main Road, Whitefield, Bengaluru",
    lat: 12.9698,
    lng: 77.7500,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    amenities: ["Parking", "Gym", "Swimming Pool", "Security", "Power Backup", "Garden"],
    ownerName: "Sneha Reddy",
    ownerPhone: "+91 99001 54321",
    createdAt: new Date("2026-10-22").toISOString()
  },
  {
    _id: "671fb100e4b01a2b3c4d5e05",
    title: "Charming 2 BHK Flat near Metro Station",
    price: 26000,
    bhk: 2,
    location: "JP Nagar 5th Phase, Bengaluru",
    lat: 12.9063,
    lng: 77.5857,
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    amenities: ["Parking", "Lift", "Security", "Garden"],
    ownerName: "Vikram Malhotra",
    ownerPhone: "+91 98860 67890",
    createdAt: new Date("2026-10-25").toISOString()
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// GET /api/properties
// Optional query params: minPrice, maxPrice, bhk, amenities, location
exports.getProperties = async (req, res) => {
  try {
    const { minPrice, maxPrice, bhk, amenities, location } = req.query;

    if (isDbConnected()) {
      const query = {};

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      if (bhk) {
        query.bhk = Number(bhk);
      }

      if (location) {
        query.location = { $regex: location, $options: "i" };
      }

      if (amenities) {
        const amenitiesList = amenities.split(",").map((a) => a.trim());
        query.amenities = { $all: amenitiesList };
      }

      const properties = await Property.find(query).sort({ createdAt: -1 });
      return res.status(200).json(properties);
    }

    // Fallback in-memory filter
    let results = [...memoryProperties];

    if (location) {
      const loc = location.toLowerCase();
      results = results.filter(
        (p) =>
          (p.location && p.location.toLowerCase().includes(loc)) ||
          (p.title && p.title.toLowerCase().includes(loc))
      );
    }

    if (bhk) {
      results = results.filter((p) => Number(p.bhk) === Number(bhk));
    }

    if (minPrice) {
      results = results.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      results = results.filter((p) => p.price <= Number(maxPrice));
    }

    if (amenities) {
      const required = amenities.split(",").map((a) => a.trim());
      results = results.filter(
        (p) => Array.isArray(p.amenities) && required.every((a) => p.amenities.includes(a))
      );
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET /api/properties/:id
exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Property not found" });
      }
      const property = await Property.findById(id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      return res.status(200).json(property);
    }

    const found = memoryProperties.find((p) => String(p._id) === String(id));
    if (!found) {
      return res.status(404).json({ error: "Property not found" });
    }
    return res.status(200).json(found);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// POST /api/properties
exports.createProperty = async (req, res) => {
  try {
    const { title, price, bhk, location, lat, lng, imageUrl, amenities, ownerName, ownerPhone } = req.body;

    if (!title || !price || !bhk || !location || lat === undefined || lng === undefined || !imageUrl || !ownerName || !ownerPhone) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    if (isDbConnected()) {
      const newProperty = await Property.create({
        title,
        price,
        bhk,
        location,
        lat,
        lng,
        imageUrl,
        amenities: amenities || [],
        ownerName,
        ownerPhone
      });
      return res.status(201).json(newProperty);
    }

    const newProperty = {
      _id: "mem-" + Date.now(),
      title,
      price: Number(price),
      bhk: Number(bhk),
      location,
      lat: Number(lat),
      lng: Number(lng),
      imageUrl,
      amenities: amenities || [],
      ownerName,
      ownerPhone,
      createdAt: new Date().toISOString()
    };
    memoryProperties.unshift(newProperty);
    return res.status(201).json(newProperty);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// PUT /api/properties/:id
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Property not found" });
      }
      const updated = await Property.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      });
      if (!updated) {
        return res.status(404).json({ error: "Property not found" });
      }
      return res.status(200).json(updated);
    }

    const index = memoryProperties.findIndex((p) => String(p._id) === String(id));
    if (index === -1) {
      return res.status(404).json({ error: "Property not found" });
    }

    memoryProperties[index] = {
      ...memoryProperties[index],
      ...req.body
    };

    return res.status(200).json(memoryProperties[index]);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// DELETE /api/properties/:id
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Property not found" });
      }
      const deleted = await Property.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ error: "Property not found" });
      }
      return res.status(200).json({ message: "Deleted" });
    }

    const index = memoryProperties.findIndex((p) => String(p._id) === String(id));
    if (index === -1) {
      return res.status(404).json({ error: "Property not found" });
    }
    memoryProperties.splice(index, 1);
    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
