/**
 * HomeFinder - Properties Router
 * Day 3 Topic: Express Router & REST API Endpoints
 * Author: Person 2 (Backend Developer)
 */
const express = require("express");
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
} = require("../controllers/propertyController");

// REST Endpoints: /api/properties
router.route("/")
  .get(getProperties)
  .post(createProperty);

router.route("/:id")
  .get(getPropertyById)
  .put(updateProperty)
  .delete(deleteProperty);

module.exports = router;
