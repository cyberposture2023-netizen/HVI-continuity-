const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const Question = require('../data/questions');
const auth = require('../middleware/auth');

// Start a new assessment
router.post('/start', auth, async (req, res) => {
  try {
    // Check if user has an active assessment
    const existingAssessment = await Assessment.findOne({ 
      user: req.user.id, 
      status: 'in-progress' 
    });

    if (existingAssessment) {
      return res.json(existingAssessment);
    }

    // Create new assessment
    const assessment = new Assessment({
      user: req.user.id,
      status: 'in-progress',
      dimensions: {
        D1: { completed: false, score: 0, answers: [] },
        D2: { completed: false, score: 0, answers: [] },
        D3: { completed: false, score: 0, answers: [] },
        D4: { completed: false, score: 0, answers: [] }
      },
      overallScore: 0
    });

    await assessment.save();
    res.status(201).json(assessment);
  } catch (error) {
    console.error('Error starting assessment:', error);
    res.status(500).json({ message: 'Server error starting assessment' });
  }
});

// Submit answers for a dimension
router.post('/:id/dimension/:dimension', auth, async (req, res) => {
  try {
    const { id, dimension } = req.params;
    const { answers } = req.body;

    // Validate dimension
    if (!['D1', 'D2', 'D3', 'D4'].includes(dimension)) {
      return res.status(400).json({ message: 'Invalid dimension' });
    }

    const assessment = await Assessment.findById(id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // Calculate dimension score
    const dimensionQuestions = Question.getQuestionsByDimension(dimension);
    let totalScore = 0;
    let maxPossibleScore = 0;

    answers.forEach(answer => {
      const question = dimensionQuestions.find(q => q.id === answer.questionId);
      if (question) {
        const selectedOption = question.options.find(opt => opt.id === answer.answer);
        if (selectedOption) {
          totalScore += selectedOption.score;
          maxPossibleScore += 5; // Maximum score per question
        }
      }
    });

    // Calculate percentage score (0-100)
    const dimensionScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

    // Update assessment
    assessment.dimensions[dimension] = {
      completed: true,
      score: dimensionScore,
      answers: answers,
      completedAt: new Date()
    };

    // Check if all dimensions are completed and calculate overall score
    const completedDimensions = Object.values(assessment.dimensions).filter(dim => dim.completed);
    
    if (completedDimensions.length === 4) {
      // Calculate overall HVI score (weighted average)
      const weights = { D1: 0.3, D2: 0.3, D3: 0.2, D4: 0.2 }; // Weight distribution
      let overallScore = 0;
      
      Object.keys(assessment.dimensions).forEach(dim => {
        overallScore += assessment.dimensions[dim].score * weights[dim];
      });

      assessment.overallScore = Math.round(overallScore);
      assessment.status = 'completed';
      assessment.completedAt = new Date();

      // Update user scores
      await updateUserScores(req.user.id, assessment);
    }

    await assessment.save();
    res.json(assessment);
  } catch (error) {
    console.error('Error submitting dimension answers:', error);
    res.status(500).json({ message: 'Server error submitting answers' });
  }
});

// Get current assessment for user
router.get('/current', auth, async (req, res) => {
  try {
    const assessment = await Assessment.findOne({ 
      user: req.user.id, 
      status: { $in: ['in-progress', 'completed'] } 
    }).sort({ createdAt: -1 });

    if (!assessment) {
      return res.status(404).json({ message: 'No assessment found' });
    }

    res.json(assessment);
  } catch (error) {
    console.error('Error fetching current assessment:', error);
    res.status(500).json({ message: 'Server error fetching assessment' });
  }
});

// Get assessment history
router.get('/history', auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({ 
      user: req.user.id,
      status: 'completed'
    }).sort({ completedAt: -1 }).limit(10);

    res.json(assessments);
  } catch (error) {
    console.error('Error fetching assessment history:', error);
    res.status(500).json({ message: 'Server error fetching history' });
  }
});

// Get specific assessment results
router.get('/:id/results', auth, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    
    if (!assessment || assessment.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    res.json(assessment);
  } catch (error) {
    console.error('Error fetching assessment results:', error);
    res.status(500).json({ message: 'Server error fetching results' });
  }
});

// Get department scores (mock data for dashboard)
router.get('/department-scores', auth, async (req, res) => {
  try {
    // Mock department data - in production, this would aggregate real user data
    const departmentScores = [
      {
        department: 'IT',
        score: 72,
        riskLevel: 'medium',
        employeeCount: 24,
        completedAssessments: 18
      },
      {
        department: 'HR',
        score: 65,
        riskLevel: 'medium',
        employeeCount: 12,
        completedAssessments: 8
      },
      {
        department: 'Finance',
        score: 58,
        riskLevel: 'high',
        employeeCount: 18,
        completedAssessments: 12
      },
      {
        department: 'Operations',
        score: 81,
        riskLevel: 'low',
        employeeCount: 32,
        completedAssessments: 25
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
    // Mock organization data
    const overview = {
      totalEmployees: 86,
      averageHVI: 67,
      completedAssessments: 42,
      highRiskDepartments: 1,
      mediumRiskDepartments: 2,
      lowRiskDepartments: 1,
      lastOrganizationScan: new Date(),
      assessmentCompletionRate: 65
    };

    res.json(overview);
  } catch (error) {
    console.error('Error fetching organization overview:', error);
    res.status(500).json({ message: 'Server error fetching organization data' });
  }
});

// Helper function to update user scores
async function updateUserScores(userId, assessment) {
  try {
    const user = await User.findById(userId);
    
    if (user) {
      user.overallHVI = assessment.overallScore;
      user.d1Score = assessment.dimensions.D1.score;
      user.d2Score = assessment.dimensions.D2.score;
      user.d3Score = assessment.dimensions.D3.score;
      user.d4Score = assessment.dimensions.D4.score;
      user.lastAssessmentDate = new Date();
      user.assessmentCount = (user.assessmentCount || 0) + 1;

      await user.save();
      console.log('User scores updated successfully for user:', userId);
    }
  } catch (error) {
    console.error('Error updating user scores:', error);
  }
}

module.exports = router;
