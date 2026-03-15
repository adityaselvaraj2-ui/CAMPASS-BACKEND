require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const feedbackRoutes = require('./routes/feedback');
const chatRoutes = require('./routes/chat');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Connect to MongoDB (but don't block server startup)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    console.log('Server will continue without MongoDB. Chat API will work, feedback will be logged only.');
  });

// Start server regardless of MongoDB connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
