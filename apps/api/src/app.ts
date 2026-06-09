import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRouter from './routes/upload';
import recapRouter from './routes/recap';

// Load env variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Enable CORS
const allowedOrigins = [
  'http://localhost:3000',
  'https://recapanytime.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // Allow dynamic localhost domains during local dev
      if (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, status: 'healthy', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/upload', uploadRouter);
app.use('/api/recap', recapRouter);

// Start Server
app.listen(port, () => {
  console.log(`[RecapAnytime API] Server is running on port ${port}`);
});
