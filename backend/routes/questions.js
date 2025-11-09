const express = require('express');
const router = express.Router();
const assessmentQuestions = require('../data/questions');
const { authenticateToken } = require('../middleware/auth');

// Get questions for a specific dimension
router.get('/dimension/:dimension', authenticateToken, (req, res) => {
  try {
    const { dimension } = req.params;
    
    const validDimensions = ['behavioral', 'technical', 'organizational', 'environmental'];
    if (!validDimensions.includes(dimension)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dimension'
      });
    }

    const questions = assessmentQuestions[dimension];
    
    if (!questions || questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No questions found for this dimension'
      });
    }

    res.json({
      success: true,
      dimension,
      questions,
      count: questions.length
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message
    });
  }
});

// Get all questions (for admin purposes)
router.get('/all', authenticateToken, (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    res.json({
      success: true,
      questions: assessmentQuestions,
      totals: {
        behavioral: assessmentQuestions.behavioral.length,
        technical: assessmentQuestions.technical.length,
        organizational: assessmentQuestions.organizational.length,
        environmental: assessmentQuestions.environmental.length
      }
    });
  } catch (error) {
    console.error('Error fetching all questions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message
    });
  }
});

module.exports = router;
