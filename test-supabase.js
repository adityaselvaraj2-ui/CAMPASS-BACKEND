// Test script to verify Supabase connection
require('dotenv').config();

// Set environment variables manually for testing
process.env.SUPABASE_URL = 'https://vzaenxhugmusaboxkcni.supabase.co';
process.env.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YWVueGh1Z211c2Fib3hrY25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NjgxNjgsImV4cCI6MjA5MDQ0NDE2OH0.iIEAhAOoHkTlq_JLyH6CMbL2gOEBkxW8cBw9tm4EunY';

const supabase = require('./config/supabase');

console.log('🔍 Testing Supabase connection...');
console.log('URL:', process.env.SUPABASE_URL);
console.log('Key:', process.env.SUPABASE_ANON_KEY ? 'Set' : 'Not set');

async function testConnection() {
  try {
    const { data, error } = await supabase.from('feedback').select('count').limit(1);
    
    if (error) {
      console.error('❌ Supabase error:', error.message);
    } else {
      console.log('✅ Supabase connection successful!');
      console.log('📊 Data:', data);
    }
  } catch (err) {
    console.error('❌ Connection error:', err.message);
  }
}

testConnection();
