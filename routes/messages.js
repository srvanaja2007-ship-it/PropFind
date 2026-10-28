// Day 3: Express REST route for contacting a property's owner.
const express = require('express');
const { createMessage } = require('../controllers/messageController');
const router = express.Router();

router.post('/', createMessage);

module.exports = router;
