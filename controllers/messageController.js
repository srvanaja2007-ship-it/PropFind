// Day 3: Controller for POST /api/messages.
const mongoose = require('mongoose');
const Property = require('../models/Property');
const Message = require('../models/Message');

exports.createMessage = async (req, res) => {
  try {
    const { propertyId, name, message } = req.body || {};
    if (!mongoose.isValidObjectId(propertyId)) {
      return res.status(400).json({ error: 'propertyId must be a valid property ID' });
    }
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'name is required' });
    }
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'message is required' });
    }
    const propertyExists = await Property.exists({ _id: propertyId });
    if (!propertyExists) {
      return res.status(400).json({ error: 'propertyId does not refer to an existing property' });
    }
    const saved = await Message.create({ propertyId, name, message });
    return res.status(201).json(saved);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ error: err.message });
    }
    console.error('Message API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
