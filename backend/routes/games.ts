
import { Router } from 'express';
import Game from '../models/Game';
import auth from '../middleware/authMiddleware';

const router = Router();

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a single game by ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ msg: 'Game not found' });
    }
    res.json(game);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new game (protected)
router.post('/', auth, async (req: any, res) => {
  const { title, description, genre, releaseDate, developer } = req.body;

  try {
    const newGame = new Game({
      title,
      description,
      genre,
      releaseDate,
      developer,
    });

    const game = await newGame.save();
    res.json(game);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
