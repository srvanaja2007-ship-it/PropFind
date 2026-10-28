/**
 * HomeFinder - Messages Router
 * Day 3 Topic: Express Router & REST API Endpoints
 * Author: Person 2 (Backend Developer)
 */
const express = require("express");
const router = express.Router();
const { createMessage } = require("../controllers/messageController");

// REST Endpoint: POST /api/messages
router.post("/", createMessage);

module.exports = router;
