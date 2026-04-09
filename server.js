require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('./config/supabase');

const feedbackRoutes = require('./routes/feedback');
const chatRoutes = require('./routes/chat');
const occupancyRoutes = require('./routes/occupancy');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://campass-nav.vercel.app', 
    'http://localhost:3000',
    'http://localhost:5173'  
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/occupancy', occupancyRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  let supabaseStatus = 'disconnected';
  let database = 'not connected';
  
  try {
    const { data, error } = await supabase.from('feedback').select('count').limit(1);
    if (!error) {
      supabaseStatus = 'connected';
      database = 'supabase';
    }
  } catch (err) {
    console.log('Supabase health check failed:', err.message);
  }
  
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: supabaseStatus,
    db_type: database
  });
});

// Supabase connection check
const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('feedback').select('count').limit(1);
    if (!error) {
      console.log('✅ Supabase Connected successfully');
      return true;
    } else {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
    return false;
  }
};

// Start server with Supabase connection
const startServer = async () => {
  const PORT = process.env.PORT || 5000;
  
  // Try to connect to Supabase (but don't block server start)
  const supabaseConnected = await checkSupabaseConnection();
  
  // Start server regardless of Supabase connection
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🤖 AI Chat: ${process.env.GROQ_API_KEY ? 'Configured' : 'Not configured'}`);
    console.log(`💾 Supabase: ${supabaseConnected ? 'Connected' : 'Using memory fallback'}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  });
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  console.log('✅ Server shut down complete');
  process.exit(0);
});

startServer().catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
