require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const feedbackRoutes = require('./routes/feedback');
const chatRoutes = require('./routes/chat');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://campass-nav.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: mongoStatus
  });
});

// Enhanced MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'campusnav',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('🔄 Server will continue without MongoDB. Feedback will be stored in memory.');
    return false;
  }
};

// Start server with MongoDB connection
const startServer = async () => {
  const PORT = process.env.PORT || 5000;
  
  // Try to connect to MongoDB (but don't block server start)
  const mongoConnected = await connectDB();
  
  // Start server regardless of MongoDB connection
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🤖 AI Chat: ${process.env.GROQ_API_KEY ? 'Configured' : 'Not configured'}`);
    console.log(`💾 MongoDB: ${mongoConnected ? 'Connected' : 'Using memory fallback'}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  });
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

startServer().catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
