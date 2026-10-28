// Day 3: Express REST API server for HomeFinder.
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const propertyRoutes = require('./routes/properties');
const messageRoutes = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 3000;

// Day 3: middleware runs before routes.
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Day 3: mount REST API routes.
app.use('/api/properties', propertyRoutes);
app.use('/api/messages', messageRoutes);

// Day 3: unknown API route returns JSON 404.
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Day 3: global Express error handling (including invalid JSON bodies).
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON request body' });
  }
  console.error('Server error:', err);
  return res.status(500).json({ error: 'Internal server error' });
});

// Day 3 + Day 4: do not accept requests until MongoDB is connected.
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`HomeFinder running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  }
}

startServer();
