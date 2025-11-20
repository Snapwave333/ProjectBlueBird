
import { Router } from 'express';
import Merch from '../models/Merch';
import auth from '../middleware/authMiddleware';

const router = Router();

// Get all merchandise
router.get('/', async (req, res) => {
  try {
    const merch = await Merch.find();
    res.json(merch);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a single item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Merch.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    res.json(item);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new merchandise item (protected)
router.post('/', auth, async (req: any, res) => {
  const { name, description, price, inStock } = req.body;

  try {
    const newMerch = new Merch({
      name,
      description,
      price,
      inStock,
    });

    const item = await newMerch.save();
    res.json(item);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
