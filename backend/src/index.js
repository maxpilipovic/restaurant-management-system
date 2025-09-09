const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(morgan('combined'));
app.use(express.json());

//Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Restaurant Management System API',
    version: '1.0.0',
    status: 'running'
  });
});

//Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

//Test API routes
app.get('/api/tables', (req, res) => {
  res.json({ 
    tables: [
      { id: 1, number: 1, capacity: 4, status: 'available' },
      { id: 2, number: 2, capacity: 2, status: 'occupied' },
      { id: 3, number: 3, capacity: 6, status: 'available' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});