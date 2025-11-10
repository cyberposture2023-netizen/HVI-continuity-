const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get dashboard data for authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get user's assessments
        const assessments = await Assessment.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(10);
        
        // Calculate statistics
        const totalAssessments = await Assessment.countDocuments({ user: userId });
        const completedAssessments = await Assessment.countDocuments({ 
            user: userId, 
            status: 'completed' 
        });
        const draftAssessments = await Assessment.countDocuments({ 
            user: userId, 
            status: 'draft' 
        });
        
        // Calculate average scores
        const completedAssessmentsWithScores = await Assessment.find({ 
            user: userId, 
            status: 'completed' 
        });
        
        let totalD1 = 0, totalD2 = 0, totalD3 = 0, totalD4 = 0, totalOverall = 0;
        let count = 0;
        
        completedAssessmentsWithScores.forEach(assessment => {
            if (assessment.scores) {
                totalD1 += assessment.scores.d1 || 0;
                totalD2 += assessment.scores.d2 || 0;
                totalD3 += assessment.scores.d3 || 0;
                totalD4 += assessment.scores.d4 || 0;
                totalOverall += assessment.scores.overall || 0;
                count++;
            }
        });
        
        const averageScores = {
            d1: count > 0 ? Math.round((totalD1 / count) * 100) / 100 : 0,
            d2: count > 0 ? Math.round((totalD2 / count) * 100) / 100 : 0,
            d3: count > 0 ? Math.round((totalD3 / count) * 100) / 100 : 0,
            d4: count > 0 ? Math.round((totalD4 / count) * 100) / 100 : 0,
            overall: count > 0 ? Math.round((totalOverall / count) * 100) / 100 : 0
        };
        
        // Get recent activity
        const recentAssessments = await Assessment.find({ user: userId })
            .sort({ updatedAt: -1 })
            .limit(5)
            .select('title status scores updatedAt');
        
        const dashboardData = {
            user: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role,
                department: req.user.department
            },
            statistics: {
                totalAssessments,
                completedAssessments,
                draftAssessments,
                completionRate: totalAssessments > 0 ? 
                    Math.round((completedAssessments / totalAssessments) * 100) : 0
            },
            scores: averageScores,
            recentAssessments,
            assessments: assessments.map(assessment => ({
                id: assessment._id,
                title: assessment.title,
                status: assessment.status,
                scores: assessment.scores,
                createdAt: assessment.createdAt,
                updatedAt: assessment.updatedAt
            }))
        };
        
        res.json(dashboardData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Server error fetching dashboard data' });
    }
});

// Get admin dashboard (admin only)
router.get('/admin', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
        // Get overall platform statistics
        const totalUsers = await User.countDocuments();
        const totalAssessments = await Assessment.countDocuments();
        const completedAssessments = await Assessment.countDocuments({ status: 'completed' });
        
        // Get user growth data (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const newUsers = await User.countDocuments({ 
            createdAt: { $gte: thirtyDaysAgo } 
        });
        
        const newAssessments = await Assessment.countDocuments({ 
            createdAt: { $gte: thirtyDaysAgo } 
        });
        
        // Get department statistics
        const departmentStats = await User.aggregate([
            {
                $group: {
                    _id: '$department',
                    userCount: { $sum: 1 },
                    assessmentCount: { 
                        $sum: { 
                            $size: '$assessments' 
                        } 
                    }
                }
            }
        ]);
        
        // Get recent platform activity
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('username email department createdAt');
            
        const recentAssessments = await Assessment.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'username email')
            .select('title status scores.userId createdAt');
        
        const adminDashboardData = {
            platformStatistics: {
                totalUsers,
                totalAssessments,
                completedAssessments,
                completionRate: totalAssessments > 0 ? 
                    Math.round((completedAssessments / totalAssessments) * 100) : 0,
                newUsersLast30Days: newUsers,
                newAssessmentsLast30Days: newAssessments
            },
            departmentStats,
            recentUsers,
            recentAssessments
        };
        
        res.json(adminDashboardData);
    } catch (error) {
        console.error('Error fetching admin dashboard:', error);
        res.status(500).json({ message: 'Server error fetching admin dashboard' });
    }
});

module.exports = router;
