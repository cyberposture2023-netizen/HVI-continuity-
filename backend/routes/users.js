const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Assessment = require('../models/Assessment');
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
        res.status(500).json({ message: 'Server error fetching user profile' });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { username, email, department, firstName, lastName } = req.body;
        
        // Check if email or username already exists (excluding current user)
        if (email) {
            const existingUser = await User.findOne({ 
                email, 
                _id: { $ne: req.user.id } 
            });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }
        
        if (username) {
            const existingUser = await User.findOne({ 
                username, 
                _id: { $ne: req.user.id } 
            });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already in use' });
            }
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { 
                $set: { 
                    username, 
                    email, 
                    department, 
                    firstName, 
                    lastName,
                    updatedAt: Date.now()
                } 
            },
            { new: true }
        ).select('-password');
        
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error updating user profile' });
    }
});

// Get user's assessments
router.get('/assessments', auth, async (req, res) => {
    try {
        const assessments = await Assessment.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        
        res.json(assessments);
    } catch (error) {
        console.error('Error fetching user assessments:', error);
        res.status(500).json({ message: 'Server error fetching user assessments' });
    }
});

// Admin routes - Get all users (admin only)
router.get('/', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
});

// Admin routes - Get user by ID (admin only)
router.get('/:id', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Get user's assessments
        const assessments = await Assessment.find({ user: req.params.id })
            .sort({ createdAt: -1 });
        
        res.json({
            user,
            assessments
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error fetching user' });
    }
});

// Admin routes - Update user (admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
        const { username, email, role, department, isActive } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { 
                $set: { 
                    username, 
                    email, 
                    role, 
                    department, 
                    isActive,
                    updatedAt: Date.now()
                } 
            },
            { new: true }
        ).select('-password');
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error updating user' });
    }
});

// Admin routes - Delete user (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
        // Prevent admin from deleting themselves
        if (req.params.id === req.user.id) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }
        
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Also delete user's assessments
        await Assessment.deleteMany({ user: req.params.id });
        
        res.json({ message: 'User and associated assessments deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error deleting user' });
    }
});

module.exports = router;
