const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const auth = require('../middleware/auth');

// GET /api/dashboard - Get user dashboard data
router.get('/', auth, async (req, res) => {
    try {
        const assessments = await Assessment.find({ user: req.user.id })
            .populate('questions')
            .sort({ createdAt: -1 });
        
        const totalAssessments = assessments.length;
        const completedAssessments = assessments.filter(a => a.completed).length;
        const totalQuestions = assessments.reduce((total, assessment) => 
            total + (assessment.questions ? assessment.questions.length : 0), 0);
        
        const recentAssessments = assessments.slice(0, 5);
        
        res.json({
            totalAssessments,
            completedAssessments,
            totalQuestions,
            recentAssessments,
            progressPercentage: totalAssessments > 0 ? Math.round((completedAssessments / totalAssessments) * 100) : 0
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Server error fetching dashboard data' });
    }
});

// GET /api/dashboard/stats - Get user statistics
router.get('/stats', auth, async (req, res) => {
    try {
        const assessments = await Assessment.find({ user: req.user.id });
        
        const categoryStats = {};
        assessments.forEach(assessment => {
            assessment.categories.forEach(category => {
                if (!categoryStats[category]) {
                    categoryStats[category] = 0;
                }
                categoryStats[category]++;
            });
        });
        
        res.json({
            totalAssessments: assessments.length,
            completedAssessments: assessments.filter(a => a.completed).length,
            categoryDistribution: categoryStats,
            averageScore: assessments.length > 0 ? 
                assessments.reduce((sum, a) => sum + (a.score || 0), 0) / assessments.length : 0
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error fetching dashboard stats' });
    }
});

// Test route for health checks
router.get('/test/health', (req, res) => {
    res.json({ status: 'ok', message: 'Dashboard route working' });
});

module.exports = router;
