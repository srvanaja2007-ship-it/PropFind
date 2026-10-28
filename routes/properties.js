// Day 3: Express REST routes. Controllers contain the logic.
const express = require('express');
const controller = require('../controllers/propertyController');
const router = express.Router();

router.get('/', controller.getProperties);
router.get('/:id', controller.getPropertyById);
router.post('/', controller.createProperty);
router.put('/:id', controller.updateProperty);
router.delete('/:id', controller.deleteProperty);

module.exports = router;
