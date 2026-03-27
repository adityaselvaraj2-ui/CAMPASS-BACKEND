# CampusCompass Backend

Node.js Express backend for CampusCompass application with MongoDB integration.

## Environment Variables

⚠️ **CRITICAL:** The `.env` file is gitignored and will not be deployed. You must set environment variables in your hosting platform.

### For Render Deployment:

1. Go to your Render dashboard
2. Select **CAMPASS-BACKEND** service
3. Go to **Environment** tab
4. Add these environment variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
```

5. Click **Save Changes**
6. Click **Manual Deploy** → **Deploy Latest Commit**

### For Local Development:

1. Copy `.env.example` to `.env`
2. Fill in your actual values
3. Run `npm install && npm start`

## API Endpoints

- `GET /api/health` - Health check with MongoDB status
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get all feedback
- `GET /api/feedback/stats` - Get feedback statistics
- `POST /api/chat` - AI chat endpoint

## Deployment Checklist

- [ ] Set MONGODB_URI in Render Environment Variables
- [ ] Set GROQ_API_KEY in Render Environment Variables
- [ ] Set PORT=5000 in Render Environment Variables
- [ ] Deploy after setting environment variables
- [ ] Test /api/health endpoint shows "mongodb": "connected"
- [ ] Submit test feedback and check MongoDB Atlas

## MongoDB Atlas

- Database: `campusnav`
- Collections: `feedbacks` (auto-created by Mongoose)
- Check data in MongoDB Atlas dashboard after submissions

## Security Notes

- Never commit real credentials to git
- Always use placeholder values in .env.example
- Set real values only in hosting platform dashboard
- .env file is automatically gitignored

## Troubleshooting

If feedback is not saving to MongoDB:

1. Check `/api/health` endpoint response
2. Verify MONGODB_URI is correct in Render dashboard
3. Check Render logs for connection errors
4. Confirm database name matches in Atlas
