const express = require('express');
const router = express.Router();
const HVIController = require('../controllers/hviController');
const auth = require('../middleware/auth');

// Comprehensive HVI Calculation
router.post('/comprehensive/:userId', auth, async (req, res) => {
  try {
    const score = await HVIController.calculateComprehensiveHVI(req.params.userId, req.body);
    res.json({ success: true, score });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Batch HVI Calculation
router.post('/batch', auth, async (req, res) => {
  try {
    const { userIds, options } = req.body;
    const results = await HVIController.calculateBatchHVI(userIds, options);
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Detailed HVI Report
router.get('/reports/detailed/:userId', auth, async (req, res) => {
  try {
    const report = await HVIController.generateDetailedHVIReport(req.params.userId);
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Department-wide HVI Analytics
router.get('/analytics/department/:department', auth, async (req, res) => {
  try {
    const users = await require('../models').User.find({
      'hviProfile.department': req.params.department,
      'hviProfile.currentHVI': { \$exists: true }
    });
    
    const analytics = {
      department: req.params.department,
      totalUsers: users.length,
      averageHVI: 0,
      riskDistribution: {
        Low: 0,
        Medium: 0,
        High: 0,
        Critical: 0
      },
      topRisks: []
    };
    
    if (users.length > 0) {
      const scores = users.map(u => u.hviProfile.currentHVI.overallHVI);
      analytics.averageHVI = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
      
      // Risk distribution
      users.forEach(user => {
        const riskLevel = user.hviProfile.currentHVI.riskLevel;
        analytics.riskDistribution[riskLevel]++;
      });
    }
    
    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
