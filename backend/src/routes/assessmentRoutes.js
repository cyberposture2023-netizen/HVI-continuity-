const express = require('express');
const router = express.Router();
const AssessmentController = require('../controllers/assessmentController');
const auth = require('../middleware/auth');

// Create new assessment
router.post('/', auth, async (req, res) => {
  try {
    const assessment = await AssessmentController.createAssessment(req.body, req.user._id);
    res.json({ success: true, assessment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all assessments with filtering
router.get('/', auth, async (req, res) => {
  try {
    const { type, status, department, page = 1, limit = 10 } = req.query;
    const filters = { type, status, department };
    
    const result = await AssessmentController.getAssessments(filters, parseInt(page), parseInt(limit));
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get assessment by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const assessment = await AssessmentController.getAssessmentById(req.params.id);
    res.json({ success: true, assessment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Assign assessment to users
router.post('/:id/assign', auth, async (req, res) => {
  try {
    const { userIds } = req.body;
    const assessment = await AssessmentController.assignAssessment(req.params.id, userIds);
    res.json({ success: true, assessment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start assessment
router.post('/:id/start', auth, async (req, res) => {
  try {
    const result = await AssessmentController.startAssessment(req.params.id, req.user._id);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit assessment responses
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { responses } = req.body;
    const result = await AssessmentController.submitResponse(req.params.id, req.user._id, responses);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get assessment analytics
router.get('/:id/analytics', auth, async (req, res) => {
  try {
    const analytics = await AssessmentController.getAssessmentAnalytics(req.params.id);
    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get assessment templates
router.get('/templates/all', auth, async (req, res) => {
  try {
    const templates = AssessmentController.getAssessmentTemplates();
    res.json({ success: true, templates });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
