
import { Router } from 'express';
import Tournament from '../models/Tournament';
import auth from '../middleware/authMiddleware';

const router = Router();

// Get all tournaments
router.get('/', async (req, res) => {
  try {
    const tournaments = await Tournament.find().populate('game');
    res.json(tournaments);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a single tournament by ID
router.get('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id).populate('game');
    if (!tournament) {
      return res.status(404).json({ msg: 'Tournament not found' });
    }
    res.json(tournament);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new tournament (protected)
router.post('/', auth, async (req: any, res) => {
  const { game, name, startDate, endDate } = req.body;

  try {
    const newTournament = new Tournament({
      game,
      name,
      startDate,
      endDate,
    });

    const tournament = await newTournament.save();
    res.json(tournament);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
