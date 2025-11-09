const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, department } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (department) user.department = department;

    await user.save();
    
    // Return user without password
    const userResponse = await User.findById(req.user.id).select('-password');
    res.json(userResponse);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Get user scores (alias for dashboard/scores)
router.get('/scores', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      overallHVI: user.overallHVI || 0,
      dimensionScores: {
        D1: user.d1Score || 0,
        D2: user.d2Score || 0,
        D3: user.d3Score || 0,
        D4: user.d4Score || 0
      },
      lastAssessmentDate: user.lastAssessmentDate
    });
  } catch (error) {
    console.error('Error fetching user scores:', error);
    res.status(500).json({ message: 'Server error fetching scores' });
  }
});

module.exports = router;
