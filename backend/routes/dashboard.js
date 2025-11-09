const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user scores for dashboard
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

// Get score trend data
router.get('/score-trend', auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(6)
      .select('overallScore createdAt');
    
    const trend = assessments.map(assessment => ({
      score: assessment.overallScore,
      date: assessment.createdAt
    })).reverse();

    res.json(trend);
  } catch (error) {
    console.error('Error fetching score trend:', error);
    res.status(500).json({ message: 'Server error fetching trend data' });
  }
});

// Get department scores (mock data for now - would integrate with org data later)
router.get('/department-scores', auth, async (req, res) => {
  try {
    // This would typically query organizational data
    // For now, returning mock data structure
    const departmentScores = [
      {
        department: 'IT',
        score: Math.floor(Math.random() * 30) + 70,
        riskLevel: 'medium',
        employeeCount: 24
      },
      {
        department: 'HR',
        score: Math.floor(Math.random() * 30) + 60,
        riskLevel: 'medium',
        employeeCount: 12
      },
      {
        department: 'Finance',
        score: Math.floor(Math.random() * 30) + 55,
        riskLevel: 'high',
        employeeCount: 18
      },
      {
        department: 'Operations',
        score: Math.floor(Math.random() * 30) + 75,
        riskLevel: 'low',
        employeeCount: 32
      }
    ];

    res.json(departmentScores);
  } catch (error) {
    console.error('Error fetching department scores:', error);
    res.status(500).json({ message: 'Server error fetching department data' });
  }
});

// Get organization overview
router.get('/organization-overview', auth, async (req, res) => {
  try {
    // Mock organizational overview - would integrate with real org data
    const overview = {
      totalEmployees: 86,
      averageHVI: 67,
      completedAssessments: 42,
      highRiskDepartments: 1,
      lastOrganizationScan: new Date()
    };

    res.json(overview);
  } catch (error) {
    console.error('Error fetching organization overview:', error);
    res.status(500).json({ message: 'Server error fetching organization data' });
  }
});

module.exports = router;
