const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Assessment = require('../models/Assessment');

// Get dashboard overview
router.get('/overview', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAssessments = await Assessment.countDocuments();
        const completedAssessments = await Assessment.countDocuments({ status: 'completed' });
        
        res.json({
            totalUsers,
            totalAssessments,
            completedAssessments,
            completionRate: totalAssessments > 0 ? Math.round((completedAssessments / totalAssessments) * 100) : 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user scores for dashboard
router.get('/scores', async (req, res) => {
    try {
        const users = await User.find().select('scores department lastName firstName');
        const scores = users.map(user => ({
            id: user._id,
            name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Unknown User',
            department: user.department || 'Unknown Department',
            scores: user.scores || { overall: 0, dimension1: 0, dimension2: 0, dimension3: 0, dimension4: 0 }
        }));
        
        res.json(scores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get recent assessments
router.get('/recent-assessments', async (req, res) => {
    try {
        const recentAssessments = await Assessment.find()
            .populate('user', 'firstName lastName department')
            .sort({ completedAt: -1 })
            .limit(10);
        
        res.json(recentAssessments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get department statistics
router.get('/department-stats', async (req, res) => {
    try {
        const stats = await User.aggregate([
            {
                $group: {
                    _id: '$department',
                    userCount: { $sum: 1 },
                    avgScore: { $avg: '$scores.overall' },
                    completedAssessments: {
                        $sum: {
                            $cond: [{ $ifNull: ['$currentAssessment', false] }, 1, 0]
                        }
                    }
                }
            }
        ]);
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
