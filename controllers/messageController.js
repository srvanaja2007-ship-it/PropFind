/**
 * HomeFinder - Message Controller
 * Day 3 Topic: Node.js, Express & REST API Business Logic
 * Author: Person 2 (Backend Developer)
 */
const mongoose = require("mongoose");
const Message = require("../models/Message");

// In-memory messages fallback
const memoryMessages = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

// POST /api/messages
exports.createMessage = async (req, res) => {
  try {
    const { propertyId, name, message } = req.body;

    if (!propertyId || !name || !message) {
      return res.status(400).json({ error: "propertyId, name, and message are required" });
    }

    if (isDbConnected()) {
      const newMessage = await Message.create({
        propertyId,
        name,
        message
      });
      return res.status(201).json(newMessage);
    }

    const newMessage = {
      _id: "msg-" + Date.now(),
      propertyId,
      name,
      message,
      createdAt: new Date().toISOString()
    };
    memoryMessages.push(newMessage);
    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
