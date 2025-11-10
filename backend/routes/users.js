const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/users/profile - Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { username, email } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { username, email },
            { new: true }
        ).select('-password');
        
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
});

// Test route for health checks
router.get('/test/health', (req, res) => {
    res.json({ status: 'ok', message: 'Users route working' });
});

module.exports = router;
