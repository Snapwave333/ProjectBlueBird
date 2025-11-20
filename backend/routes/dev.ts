
import { Router } from 'express';
import Game from '../models/Game';
import Tournament from '../models/Tournament';
import Merch from '../models/Merch';

const router = Router();

// Seed the database
router.get('/seed', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ msg: 'This route is only available in development mode' });
  }

  try {
    // Clear existing data
    await Game.deleteMany({});
    await Tournament.deleteMany({});
    await Merch.deleteMany({});

    // Seed games
    const games = await Game.insertMany([
      { title: 'Game 1', description: 'This is game 1', genre: 'Action', releaseDate: new Date(), developer: 'Dev 1' },
      { title: 'Game 2', description: 'This is game 2', genre: 'Adventure', releaseDate: new Date(), developer: 'Dev 2' },
    ]);

    // Seed tournaments
    await Tournament.insertMany([
      { game: games[0]._id, name: 'Tournament 1', startDate: new Date(), endDate: new Date() },
      { game: games[1]._id, name: 'Tournament 2', startDate: new Date(), endDate: new Date() },
    ]);

    // Seed merch
    await Merch.insertMany([
      { name: 'T-shirt', description: 'A cool t-shirt', price: 20, inStock: 100 },
      { name: 'Mug', description: 'A cool mug', price: 10, inStock: 200 },
    ]);

    res.json({ msg: 'Database seeded' });

  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
