const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials not found in environment variables');
  console.warn('Please create a .env file with SUPABASE_URL and SUPABASE_ANON_KEY');
  // Export a mock client that will fail gracefully
  module.exports = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') }),
      insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
    })
  };
} else {
  const supabase = createClient(supabaseUrl, supabaseKey);
  module.exports = supabase;
}
