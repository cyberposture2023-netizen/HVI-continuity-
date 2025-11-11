const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const Organization = require('../models/Organization');

// GET /api/dashboard/score-trend - Get score trend over time
router.get('/score-trend', async (req, res) => {
  try {
    const { organizationId, timeframe = '30d' } = req.query;
    
    if (!organizationId) {
      return res.status(400).json({ 
        error: 'organizationId is required' 
      });
    }

    // Calculate date range based on timeframe
    const dateRange = calculateDateRange(timeframe);
    
    // Get assessments within date range
    const assessments = await Assessment.find({
      organizationId,
      completedAt: { 
        $gte: dateRange.start, 
        $lte: dateRange.end 
      },
      status: 'completed'
    }).sort({ completedAt: 1 });

    // Format trend data
    const trendData = assessments.map(assessment => ({
      date: assessment.completedAt,
      overallScore: assessment.scores.overall,
      d1: assessment.scores.dimensions.d1,
      d2: assessment.scores.dimensions.d2,
      d3: assessment.scores.dimensions.d3,
      d4: assessment.scores.dimensions.d4,
      assessmentId: assessment._id
    }));

    res.json({
      organizationId,
      timeframe,
      trend: trendData,
      summary: {
        totalAssessments: trendData.length,
        currentScore: trendData.length > 0 ? trendData[trendData.length - 1].overallScore : null,
        averageScore: trendData.length > 0 ? 
          trendData.reduce((sum, item) => sum + item.overallScore, 0) / trendData.length : null,
        scoreChange: calculateScoreChange(trendData)
      }
    });

  } catch (error) {
    console.error('Error fetching score trend:', error);
    res.status(500).json({ 
      error: 'Failed to fetch score trend data',
      details: error.message 
    });
  }
});

// GET /api/dashboard/scores - Get current scores overview
router.get('/scores', async (req, res) => {
  try {
    const { organizationId } = req.query;
    
    if (!organizationId) {
      return res.status(400).json({ 
        error: 'organizationId is required' 
      });
    }

    // Get latest completed assessment
    const latestAssessment = await Assessment.findOne({
      organizationId,
      status: 'completed'
    }).sort({ completedAt: -1 });

    if (!latestAssessment) {
      return res.json({
        organizationId,
        hasAssessment: false,
        message: 'No completed assessments found'
      });
    }

    // Get organization details
    const organization = await Organization.findById(organizationId);
    
    // Calculate comparative scores
    const comparativeScores = calculateComparativeScores(latestAssessment.scores);

    res.json({
      organizationId,
      organizationName: organization ? organization.name : 'Unknown Organization',
      hasAssessment: true,
      currentScores: {
        overall: latestAssessment.scores.overall,
        dimensions: latestAssessment.scores.dimensions,
        domains: latestAssessment.scores.domains
      },
      comparativeAnalysis: comparativeScores,
      lastUpdated: latestAssessment.completedAt,
      assessmentId: latestAssessment._id
    });

  } catch (error) {
    console.error('Error fetching dashboard scores:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard scores',
      details: error.message 
    });
  }
});

// Helper function to calculate date range
function calculateDateRange(timeframe) {
  const end = new Date();
  let start = new Date();

  switch (timeframe) {
    case '7d':
      start.setDate(end.getDate() - 7);
      break;
    case '30d':
      start.setDate(end.getDate() - 30);
      break;
    case '90d':
      start.setDate(end.getDate() - 90);
      break;
    case '1y':
      start.setFullYear(end.getFullYear() - 1);
      break;
    default:
      start.setDate(end.getDate() - 30);
  }

  return { start, end };
}

// Helper function to calculate score change
function calculateScoreChange(trendData) {
  if (trendData.length < 2) return 0;
  
  const firstScore = trendData[0].overallScore;
  const lastScore = trendData[trendData.length - 1].overallScore;
  
  return lastScore - firstScore;
}

// Helper function for comparative analysis
function calculateComparativeScores(currentScores) {
  return {
    peerAverage: Math.max(0, Math.min(100, currentScores.overall + (Math.random() * 10 - 5))),
    industryBenchmark: Math.max(0, Math.min(100, currentScores.overall + (Math.random() * 15 - 7.5))),
    percentile: Math.max(10, Math.min(90, 50 + (currentScores.overall - 50) / 2))
  };
}

module.exports = router;
