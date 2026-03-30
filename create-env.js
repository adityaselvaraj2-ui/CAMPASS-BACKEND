const fs = require('fs');

const envContent = `# Supabase Configuration
SUPABASE_URL=https://vzaenxhugmusaboxkcni.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YWVueGh1Z211c2Fib3hrY25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NjgxNjgsImV4cCI6MjA5MDQ0NDE2OH0.iIEAhAOoHkTlq_JLyH6CMbL2gOEBkxW8cBw9tm4EunY

# Other Configuration
GROQ_API_KEY=your_groq_api_key_here
PORT=5001
`;

fs.writeFileSync('.env', envContent);
console.log('✅ .env file created successfully!');
console.log('🚀 You can now run: npm run dev');
