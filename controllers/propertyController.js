// Day 3: Property REST API controllers, validation and query filtering.
const mongoose = require('mongoose');
const Property = require('../models/Property');

const ALLOWED_AMENITIES = [
  'Parking', 'Gym', 'Swimming Pool', 'Lift',
  'Security', 'Power Backup', 'Garden'
];
const REQUIRED_FIELDS = [
  'title', 'price', 'bhk', 'location', 'lat', 'lng',
  'imageUrl', 'amenities', 'ownerName', 'ownerPhone'
];

function errorResponse(res, err) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ error: err.message });
  }
  console.error('Property API error:', err);
  return res.status(500).json({ error: 'Internal server error' });
}

// Day 3: validate the shared Property JSON contract for POST and PUT.
function validateProperty(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be a JSON object';
  }
  for (const field of REQUIRED_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(body, field)) {
      return `${field} is required`;
    }
  }
  for (const field of ['title', 'location', 'imageUrl', 'ownerName', 'ownerPhone']) {
    if (typeof body[field] !== 'string' || !body[field].trim()) {
      return `${field} must be a non-empty string`;
    }
  }
  if (typeof body.price !== 'number' || !Number.isFinite(body.price) || body.price < 0) {
    return 'price must be a non-negative number';
  }
  if (!Number.isInteger(body.bhk) || body.bhk < 1 || body.bhk > 4) {
    return 'bhk must be an integer from 1 to 4';
  }
  if (typeof body.lat !== 'number' || !Number.isFinite(body.lat) || body.lat < -90 || body.lat > 90) {
    return 'lat must be a number between -90 and 90';
  }
  if (typeof body.lng !== 'number' || !Number.isFinite(body.lng) || body.lng < -180 || body.lng > 180) {
    return 'lng must be a number between -180 and 180';
  }
  if (!Array.isArray(body.amenities) || body.amenities.some(a => !ALLOWED_AMENITIES.includes(a))) {
    return `amenities must be an array containing only: ${ALLOWED_AMENITIES.join(', ')}`;
  }
  return null;
}

function propertyData(body) {
  return Object.fromEntries(REQUIRED_FIELDS.map(field => [field, body[field]]));
}

// Day 3: GET /api/properties with Mongoose query param filtering.
exports.getProperties = async (req, res) => {
  try {
    const { minPrice, maxPrice, bhk, amenities, location } = req.query;
    const filter = {};
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      for (const [key, operator] of [['minPrice', '$gte'], ['maxPrice', '$lte']]) {
        if (req.query[key] !== undefined) {
          const raw = req.query[key];
          const n = Number(raw);
          if (typeof raw !== 'string' || !raw.trim() || !Number.isFinite(n) || n < 0) {
            return res.status(400).json({ error: `${key} must be a non-negative number` });
          }
          filter.price[operator] = n;
        }
      }
      if (filter.price.$gte !== undefined && filter.price.$lte !== undefined && filter.price.$gte > filter.price.$lte) {
        return res.status(400).json({ error: 'minPrice cannot exceed maxPrice' });
      }
    }
    if (bhk !== undefined) {
      const n = Number(bhk);
      if (typeof bhk !== 'string' || !bhk.trim() || !Number.isInteger(n) || n < 1 || n > 4) {
        return res.status(400).json({ error: 'bhk must be an integer from 1 to 4' });
      }
      filter.bhk = n;
    }
    if (amenities !== undefined) {
      if (typeof amenities !== 'string' || !amenities.trim()) {
        return res.status(400).json({ error: 'amenities must be a comma-separated list' });
      }
      const values = amenities.split(',').map(a => a.trim());
      if (values.some(a => !ALLOWED_AMENITIES.includes(a))) {
        return res.status(400).json({ error: 'Invalid amenity in query' });
      }
      filter.amenities = { $all: values };
    }
    if (location !== undefined) {
      if (typeof location !== 'string') {
        return res.status(400).json({ error: 'location must be text' });
      }
      // Escape regex metacharacters: location is a literal partial-text match.
      const escaped = location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.location = { $regex: escaped, $options: 'i' };
    }
    const properties = await Property.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(properties);
  } catch (err) {
    return errorResponse(res, err);
  }
};

// Day 3: GET one property by MongoDB ObjectId.
exports.getPropertyById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    return res.status(200).json(property);
  } catch (err) {
    return errorResponse(res, err);
  }
};

// Day 3: POST a new property.
exports.createProperty = async (req, res) => {
  try {
    const error = validateProperty(req.body);
    if (error) return res.status(400).json({ error });
    const property = await Property.create(propertyData(req.body));
    return res.status(201).json(property);
  } catch (err) {
    return errorResponse(res, err);
  }
};

// Day 3: PUT replaces the editable fields of a property.
exports.updateProperty = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }
    const error = validateProperty(req.body);
    if (error) return res.status(400).json({ error });
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      propertyData(req.body),
      { new: true, runValidators: true }
    );
    if (!property) return res.status(404).json({ error: 'Property not found' });
    return res.status(200).json(property);
  } catch (err) {
    return errorResponse(res, err);
  }
};

// Day 3: DELETE a property.
exports.deleteProperty = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    return errorResponse(res, err);
  }
};
