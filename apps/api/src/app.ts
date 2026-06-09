import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRouter from './routes/upload';
import recapRouter from './routes/recap';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = [
  'http://localhost:3000',
  'https://recapanytime.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (
        process.env.NODE_ENV !== 'production' &&
        origin.startsWith('http://localhost:')
      ) {
        return callback(null, true);
      }

      return callback(
        new Error('The CORS policy for this site does not allow access from the specified Origin.'),
        false
      );
    },
    credentials: true
  })
);

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    ok: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/upload', uploadRouter);
app.use('/api/recap', recapRouter);

app.listen(port, () => {
  console.log(`[RecapAnytime API] Server is running on port ${port}`);
});
