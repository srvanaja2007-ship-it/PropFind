// Day 4: local database CRUD smoke test (do not commit this file)
require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Property = require('./models/Property');
const Message = require('./models/Message');

const testDatabase = async () => {
  try {
    await connectDB();

    const createdProperty = await Property.create({
      title: 'Temporary test home', price: 20000, bhk: 1, location: 'Test Layout',
      lat: 12.9716, lng: 77.5946, amenities: ['Gym'],
      ownerName: 'Test Owner', ownerPhone: '9000000000'
    });
    console.log('Created property:', createdProperty);

    const foundProperty = await Property.findById(createdProperty._id);
    console.log('Found property:', foundProperty);

    const updatedProperty = await Property.findByIdAndUpdate(
      createdProperty._id,
      { price: 21000 },
      { returnDocument: 'after', runValidators: true }
    );
    console.log('Updated property:', updatedProperty);

    const deletedProperty = await Property.findByIdAndDelete(createdProperty._id);
    console.log('Deleted property:', deletedProperty);

    const message = await Message.create({
      propertyId: createdProperty._id,
      name: 'Test Visitor',
      message: 'Is this property still available?'
    });
    console.log('Created message:', message);
  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    await mongoose.disconnect();
  }
};

testDatabase();
