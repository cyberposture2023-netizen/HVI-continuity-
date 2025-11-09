const express = require('express');
const router = express.Router();
const HVIController = require('../controllers/hviController');
const auth = require('../middleware/auth');

// HVI Assessment Routes
router.post('/assessments/calculate', auth, async (req, res) => {
  try {
    const { userId, assessmentData } = req.body;
    const hviScore = await HVIController.calculateHVI(userId, assessmentData);
    res.json({ success: true, hviScore });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// HVI Report Routes
router.get('/reports/user/:userId', auth, async (req, res) => {
  try {
    const report = await HVIController.generateHVIReport(req.params.userId);
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Department Comparison Route
router.get('/comparison/department/:department', auth, async (req, res) => {
  try {
    const comparison = await HVIController.getDepartmentComparison(req.params.department);
    res.json({ success: true, comparison });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// HVI Trends Route
router.get('/trends/user/:userId', auth, async (req, res) => {
  try {
    const user = await require('../models').User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    const trends = HVIController.calculateHVITrend(user.hviProfile.hviHistory);
    res.json({ success: true, trends });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
