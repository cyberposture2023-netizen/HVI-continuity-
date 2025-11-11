const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const Organization = require('../models/Organization');

// GET /api/assessments/current - Get current assessment for organization
router.get('/current', async (req, res) => {
  try {
    const { organizationId } = req.query;
    
    if (!organizationId) {
      return res.status(400).json({ 
        error: 'organizationId is required' 
      });
    }

    // Find current assessment
    let currentAssessment = await Assessment.findOne({
      organizationId,
      $or: [
        { status: 'in-progress' },
        { status: 'completed' }
      ]
    }).sort({ createdAt: -1 });

    // If no assessment exists, create a new one
    if (!currentAssessment) {
      const organization = await Organization.findById(organizationId);
      if (!organization) {
        return res.status(404).json({ 
          error: 'Organization not found' 
        });
      }

      currentAssessment = new Assessment({
        organizationId,
        organizationName: organization.name,
        status: 'not-started',
        responses: [],
        scores: {
          overall: 0,
          dimensions: { d1: 0, d2: 0, d3: 0, d4: 0 },
          domains: {}
        }
      });

      await currentAssessment.save();
    }

    // Prepare response based on assessment status
    const response = {
      assessmentId: currentAssessment._id,
      organizationId: currentAssessment.organizationId,
      organizationName: currentAssessment.organizationName,
      status: currentAssessment.status,
      createdAt: currentAssessment.createdAt,
      updatedAt: currentAssessment.updatedAt
    };

    // Add additional fields based on status
    if (currentAssessment.status === 'completed') {
      response.completedAt = currentAssessment.completedAt;
      response.scores = currentAssessment.scores;
      response.summary = generateAssessmentSummary(currentAssessment);
    } else if (currentAssessment.status === 'in-progress') {
      response.currentSection = currentAssessment.currentSection;
      response.progress = calculateProgress(currentAssessment);
      response.nextAction = determineNextAction(currentAssessment);
    }

    res.json(response);

  } catch (error) {
    console.error('Error fetching current assessment:', error);
    res.status(500).json({ 
      error: 'Failed to fetch current assessment',
      details: error.message 
    });
  }
});

// Helper function to calculate assessment progress
function calculateProgress(assessment) {
  if (!assessment.responses || assessment.responses.length === 0) {
    return 0;
  }

  const totalQuestions = 40;
  const answeredQuestions = assessment.responses.filter(r => r.answer !== null && r.answer !== undefined).length;
  
  return Math.round((answeredQuestions / totalQuestions) * 100);
}

// Helper function to determine next action
function determineNextAction(assessment) {
  if (assessment.status === 'not-started') {
    return 'start-assessment';
  }
  
  if (assessment.currentSection) {
    return 'continue-' + assessment.currentSection;
  }
  
  return 'resume-assessment';
}

// Helper function to generate assessment summary
function generateAssessmentSummary(assessment) {
  const scores = assessment.scores;
  
  return {
    overall: {
      score: scores.overall,
      level: getScoreLevel(scores.overall),
      description: getOverallDescription(scores.overall)
    },
    dimensions: {
      d1: {
        score: scores.dimensions.d1,
        level: getScoreLevel(scores.dimensions.d1),
        description: 'Leadership & Governance'
      },
      d2: {
        score: scores.dimensions.d2,
        level: getScoreLevel(scores.dimensions.d2),
        description: 'Technology & Infrastructure'
      },
      d3: {
        score: scores.dimensions.d3,
        level: getScoreLevel(scores.dimensions.d3),
        description: 'Process & Operations'
      },
      d4: {
        score: scores.dimensions.d4,
        level: getScoreLevel(scores.dimensions.d4),
        description: 'People & Culture'
      }
    },
    recommendations: generateRecommendations(scores)
  };
}

// Helper function to get score level
function getScoreLevel(score) {
  if (score >= 80) return 'advanced';
  if (score >= 60) return 'proficient';
  if (score >= 40) return 'developing';
  return 'beginning';
}

// Helper function to get overall description
function getOverallDescription(score) {
  if (score >= 80) return 'Highly mature digital continuity capabilities';
  if (score >= 60) return 'Well-developed digital continuity practices';
  if (score >= 40) return 'Developing digital continuity foundation';
  return 'Early stages of digital continuity maturity';
}

// Helper function to generate recommendations
function generateRecommendations(scores) {
  const recommendations = [];
  const dimensions = scores.dimensions;
  
  // Identify lowest scoring dimension for priority recommendation
  const dimensionEntries = Object.entries(dimensions);
  const lowestDimension = dimensionEntries.sort((a, b) => a[1] - b[1])[0];
  
  switch (lowestDimension[0]) {
    case 'd1':
      recommendations.push({
        priority: 'high',
        dimension: 'D1',
        title: 'Strengthen Leadership Commitment',
        description: 'Establish executive sponsorship and formal governance structure for digital continuity',
        action: 'develop-governance-framework'
      });
      break;
    case 'd2':
      recommendations.push({
        priority: 'high',
        dimension: 'D2',
        title: 'Enhance Technical Infrastructure',
        description: 'Invest in robust digital preservation systems and data integrity controls',
        action: 'assess-technology-gaps'
      });
      break;
    case 'd3':
      recommendations.push({
        priority: 'high',
        dimension: 'D3',
        title: 'Improve Operational Processes',
        description: 'Develop standardized procedures for digital asset management and continuity planning',
        action: 'document-processes'
      });
      break;
    case 'd4':
      recommendations.push({
        priority: 'high',
        dimension: 'D4',
        title: 'Build Organizational Capability',
        description: 'Provide training and develop skills for digital continuity management',
        action: 'create-training-program'
      });
      break;
  }
  
  // Add general recommendations for all dimensions below 70
  dimensionEntries.forEach(([dim, score]) => {
    if (score < 70 && dim !== lowestDimension[0]) {
      const dimensionNames = { d1: 'Leadership', d2: 'Technology', d3: 'Process', d4: 'People' };
      recommendations.push({
        priority: 'medium',
        dimension: dim.toUpperCase(),
        title: 'Enhance ' + dimensionNames[dim] + ' Capabilities',
        description: 'Continue improving ' + dimensionNames[dim].toLowerCase() + ' aspects of digital continuity',
        action: 'improve-' + dim
      });
    }
  });
  
  return recommendations;
}

module.exports = router;
