
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import gameRoutes from './routes/games';
import tournamentRoutes from './routes/tournaments';
import merchRoutes from './routes/merch';
import userRoutes from './routes/user';
import devRoutes from './routes/dev';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gameday', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
} as any).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/merch', merchRoutes);
app.use('/api/user', userRoutes);

if (process.env.NODE_ENV === 'development') {
  app.use('/api/dev', devRoutes);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
