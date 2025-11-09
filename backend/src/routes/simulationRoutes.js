const express = require('express');
const router = express.Router();
const SimulationController = require('../controllers/simulationController');
const auth = require('../middleware/auth');

// Create new simulation
router.post('/', auth, async (req, res) => {
  try {
    const simulation = await SimulationController.createSimulation(req.body);
    res.json({ success: true, simulation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Launch simulation
router.post('/:id/launch', auth, async (req, res) => {
  try {
    const result = await SimulationController.launchSimulation(req.params.id);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Record participant action
router.post('/:id/participants/:userId/actions', auth, async (req, res) => {
  try {
    const participant = await SimulationController.recordAction(
      req.params.id, 
      req.params.userId, 
      req.body
    );
    res.json({ success: true, participant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Complete simulation for participant
router.post('/:id/participants/:userId/complete', auth, async (req, res) => {
  try {
    const participant = await SimulationController.completeSimulation(
      req.params.id,
      req.params.userId,
      req.body
    );
    res.json({ success: true, participant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get simulation analytics
router.get('/:id/analytics', auth, async (req, res) => {
  try {
    const analytics = await SimulationController.getSimulationAnalytics(req.params.id);
    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get simulation templates
router.get('/templates', auth, async (req, res) => {
  try {
    const templates = SimulationController.getSimulationTemplates();
    res.json({ success: true, templates });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all simulations
router.get('/', auth, async (req, res) => {
  try {
    const simulations = await require('../models').Simulation.find()
      .populate('createdBy', 'username profile.firstName profile.lastName')
      .sort({ createdAt: -1 });
    res.json({ success: true, simulations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get simulation by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const simulation = await require('../models').Simulation.findById(req.params.id)
      .populate('createdBy', 'username profile.firstName profile.lastName')
      .populate('participants.userId', 'username profile.firstName profile.lastName hviProfile.department');
    res.json({ success: true, simulation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
