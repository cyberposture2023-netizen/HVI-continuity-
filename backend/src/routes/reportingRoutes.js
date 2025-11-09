const express = require('express');
const router = express.Router();
const ReportingController = require('../controllers/reportingController');
const auth = require('../middleware/auth');

// Generate comprehensive user HVI report
router.get('/user/:userId/comprehensive', auth, async (req, res) => {
  try {
    const report = await ReportingController.generateUserHVIReport(req.params.userId, req.query);
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate department risk report
router.get('/department/:department', auth, async (req, res) => {
  try {
    const users = await require('../models').User.find({
      'hviProfile.department': req.params.department,
      'hviProfile.currentHVI': { \$exists: true }
    }).populate('hviProfile.currentHVI');
    
    const departmentReport = {
      department: req.params.department,
      totalUsers: users.length,
      riskDistribution: {
        Low: 0,
        Medium: 0,
        High: 0,
        Critical: 0
      },
      averageHVI: 0,
      topRisks: [],
      recommendations: []
    };
    
    if (users.length > 0) {
      const scores = users.map(u => u.hviProfile.currentHVI.overallHVI);
      departmentReport.averageHVI = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
      
      // Calculate risk distribution
      users.forEach(user => {
        const riskLevel = user.hviProfile.currentHVI.riskLevel;
        departmentReport.riskDistribution[riskLevel]++;
      });
      
      // Identify common risks
      const allRiskFactors = users.flatMap(u => 
        u.hviProfile.currentHVI.riskBreakdown?.criticalRisks?.map(r => r.risk) || []
      );
      
      const riskCounts = allRiskFactors.reduce((acc, risk) => {
        acc[risk] = (acc[risk] || 0) + 1;
        return acc;
      }, {});
      
      departmentReport.topRisks = Object.entries(riskCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([risk, count]) => ({ risk, affectedUsers: count }));
    }
    
    res.json({ success: true, report: departmentReport });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate organizational overview report
router.get('/organization/overview', auth, async (req, res) => {
  try {
    const users = await require('../models').User.find({
      'hviProfile.currentHVI': { \$exists: true }
    }).populate('hviProfile.currentHVI');
    
    const departments = await require('../models').User.distinct('hviProfile.department');
    
    const orgReport = {
      generatedAt: new Date(),
      totalAssessedUsers: users.length,
      overallRiskPosture: 'Calculating...',
      departmentBreakdown: {},
      keyMetrics: {
        averageHVI: 0,
        highRiskUsers: 0,
        criticalRiskUsers: 0,
        improvementRate: 'Calculating...'
      }
    };
    
    if (users.length > 0) {
      const scores = users.map(u => u.hviProfile.currentHVI.overallHVI);
      orgReport.keyMetrics.averageHVI = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
      orgReport.keyMetrics.highRiskUsers = users.filter(u => u.hviProfile.currentHVI.riskLevel === 'High').length;
      orgReport.keyMetrics.criticalRiskUsers = users.filter(u => u.hviProfile.currentHVI.riskLevel === 'Critical').length;
      
      // Determine overall posture
      const avgScore = orgReport.keyMetrics.averageHVI;
      if (avgScore >= 70) orgReport.overallRiskPosture = 'Low Risk';
      else if (avgScore >= 50) orgReport.overallRiskPosture = 'Moderate Risk';
      else if (avgScore >= 30) orgReport.overallRiskPosture = 'High Risk';
      else orgReport.overallRiskPosture = 'Critical Risk';
      
      // Department breakdown
      for (const dept of departments) {
        const deptUsers = users.filter(u => u.hviProfile.department === dept);
        if (deptUsers.length > 0) {
          const deptScores = deptUsers.map(u => u.hviProfile.currentHVI.overallHVI);
          orgReport.departmentBreakdown[dept] = {
            userCount: deptUsers.length,
            averageHVI: Math.round(deptScores.reduce((sum, s) => sum + s, 0) / deptScores.length),
            riskProfile: this.calculateDepartmentRisk(deptScores)
          };
        }
      }
    }
    
    res.json({ success: true, report: orgReport });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper function for department risk calculation
function calculateDepartmentRisk(scores) {
  const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  if (average >= 70) return 'Low Risk';
  if (average >= 50) return 'Moderate Risk';
  if (average >= 30) return 'High Risk';
  return 'Critical Risk';
}

module.exports = router;
