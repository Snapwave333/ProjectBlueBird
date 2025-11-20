
import { Router } from 'express';
import User from '../models/User';
import auth from '../middleware/authMiddleware';

const router = Router();

// Get user profile
router.get('/me', auth, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json(user);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update user profile
router.put('/me', auth, async (req: any, res) => {
  const { firstName, lastName, avatar } = req.body;

  const profileFields = { firstName, lastName, avatar };

  try {
    let user = await User.findById(req.user.id);

    if (user) {
      user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: { profile: profileFields } },
        { new: true }
      );
      return res.json(user);
    }

    res.status(404).json({ msg: 'User not found' });

  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
