const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const auth = require('../middleware/auth');

// GET /api/assessments - Get all assessments for user
router.get('/', auth, async (req, res) => {
    try {
        const assessments = await Assessment.find({ user: req.user.id });
        res.json(assessments);
    } catch (error) {
        console.error('Error fetching assessments:', error);
        res.status(500).json({ message: 'Server error fetching assessments' });
    }
});

// GET /api/assessments/:id - Get single assessment
router.get('/:id', auth, async (req, res) => {
    try {
        const assessment = await Assessment.findOne({ 
            _id: req.params.id, 
            user: req.user.id 
        }).populate('questions');
        
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        
        res.json(assessment);
    } catch (error) {
        console.error('Error fetching assessment:', error);
        res.status(500).json({ message: 'Server error fetching assessment' });
    }
});

// POST /api/assessments - Create new assessment
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, categories, questions } = req.body;
        
        const newAssessment = new Assessment({
            title,
            description,
            categories,
            questions,
            user: req.user.id
        });
        
        const savedAssessment = await newAssessment.save();
        res.status(201).json(savedAssessment);
    } catch (error) {
        console.error('Error creating assessment:', error);
        res.status(500).json({ message: 'Server error creating assessment' });
    }
});

// PUT /api/assessments/:id - Update assessment
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, description, categories, questions } = req.body;
        
        const updatedAssessment = await Assessment.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title, description, categories, questions },
            { new: true }
        );
        
        if (!updatedAssessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        
        res.json(updatedAssessment);
    } catch (error) {
        console.error('Error updating assessment:', error);
        res.status(500).json({ message: 'Server error updating assessment' });
    }
});

// DELETE /api/assessments/:id - Delete assessment
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedAssessment = await Assessment.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        
        if (!deletedAssessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        
        res.json({ message: 'Assessment deleted successfully' });
    } catch (error) {
        console.error('Error deleting assessment:', error);
        res.status(500).json({ message: 'Server error deleting assessment' });
    }
});

// Test route for health checks
router.get('/test/health', (req, res) => {
    res.json({ status: 'ok', message: 'Assessments route working' });
});

module.exports = router;
