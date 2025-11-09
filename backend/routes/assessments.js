const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// Start a new assessment
router.post('/start', authenticateToken, async (req, res) => {
  try {
    const { assessmentType = 'full', department } = req.body;
    
    const newAssessment = new Assessment({
      userId: req.user.id,
      assessmentType,
      department: department || req.user.department,
      status: 'in-progress',
      startDate: new Date(),
      dimensions: {
        behavioral: { score: 0, answers: [] },
        technical: { score: 0, answers: [] },
        organizational: { score: 0, answers: [] },
        environmental: { score: 0, answers: [] }
      }
    });

    await newAssessment.save();
    res.status(201).json({
      success: true,
      message: 'Assessment started successfully',
      assessment: newAssessment
    });
  } catch (error) {
    console.error('Error starting assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting assessment',
      error: error.message
    });
  }
});

// Submit answers for a dimension
router.post('/:assessmentId/dimension/:dimension', authenticateToken, async (req, res) => {
  try {
    const { assessmentId, dimension } = req.params;
    const { answers } = req.body;

    // Validate dimension
    const validDimensions = ['behavioral', 'technical', 'organizational', 'environmental'];
    if (!validDimensions.includes(dimension)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dimension'
      });
    }

    const assessment = await Assessment.findOne({
      _id: assessmentId,
      userId: req.user.id
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Calculate dimension score
    const dimensionScore = calculateDimensionScore(answers);
    
    // Update assessment with new answers and score
    assessment.dimensions[dimension] = {
      score: dimensionScore,
      answers: answers,
      completedAt: new Date()
    };

    // Check if all dimensions are completed
    const allDimensionsCompleted = validDimensions.every(dim => 
      assessment.dimensions[dim].answers.length > 0
    );

    if (allDimensionsCompleted) {
      assessment.status = 'completed';
      assessment.completionDate = new Date();
      assessment.overallScore = calculateOverallScore(assessment.dimensions);
      
      // Update user's latest scores
      await User.findByIdAndUpdate(req.user.id, {
        $set: {
          'scores.overall': assessment.overallScore,
          'scores.behavioral': assessment.dimensions.behavioral.score,
          'scores.technical': assessment.dimensions.technical.score,
          'scores.organizational': assessment.dimensions.organizational.score,
          'scores.environmental': assessment.dimensions.environmental.score,
          lastAssessmentDate: new Date()
        }
      });
    }

    await assessment.save();

    res.json({
      success: true,
      message: 'Dimension answers submitted successfully',
      dimensionScore,
      overallScore: assessment.overallScore,
      isComplete: allDimensionsCompleted
    });
  } catch (error) {
    console.error('Error submitting dimension answers:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting answers',
      error: error.message
    });
  }
});

// Get user's current assessment
router.get('/current', authenticateToken, async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      userId: req.user.id,
      status: 'in-progress'
    }).sort({ startDate: -1 });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'No current assessment found'
      });
    }

    res.json({
      success: true,
      assessment
    });
  } catch (error) {
    console.error('Error fetching current assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching current assessment',
      error: error.message
    });
  }
});

// Get user's assessment history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const assessments = await Assessment.find({ userId: req.user.id })
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Assessment.countDocuments({ userId: req.user.id });

    res.json({
      success: true,
      assessments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching assessment history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assessment history',
      error: error.message
    });
  }
});

// Get assessment by ID
router.get('/:assessmentId', authenticateToken, async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      _id: req.params.assessmentId,
      userId: req.user.id
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    res.json({
      success: true,
      assessment
    });
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assessment',
      error: error.message
    });
  }
});

// Helper function to calculate dimension score
function calculateDimensionScore(answers) {
  if (!answers || answers.length === 0) return 0;
  
  const totalScore = answers.reduce((sum, answer) => sum + (answer.score || 0), 0);
  const maxPossibleScore = answers.length * 4; // Assuming 0-4 scale
  
  // Convert to percentage and invert so higher score = lower risk
  const riskPercentage = (totalScore / maxPossibleScore) * 100;
  
  // Convert to 0-100 scale where 100 is best (no risk)
  return Math.round(100 - riskPercentage);
}

// Helper function to calculate overall HVI score
function calculateOverallScore(dimensions) {
  const weights = {
    behavioral: 0.3,
    technical: 0.3,
    organizational: 0.2,
    environmental: 0.2
  };

  const weightedSum = 
    (dimensions.behavioral.score * weights.behavioral) +
    (dimensions.technical.score * weights.technical) +
    (dimensions.organizational.score * weights.organizational) +
    (dimensions.environmental.score * weights.environmental);

  return Math.round(weightedSum);
}

module.exports = router;
