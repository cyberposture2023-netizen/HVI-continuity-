const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const auth = require('../middleware/auth');

// Get all assessments for authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const assessments = await Assessment.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(assessments);
    } catch (error) {
        console.error('Error fetching assessments:', error);
        res.status(500).json({ message: 'Server error fetching assessments' });
    }
});

// Get specific assessment by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const assessment = await Assessment.findOne({ 
            _id: req.params.id, 
            user: req.user.id 
        });
        
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        
        res.json(assessment);
    } catch (error) {
        console.error('Error fetching assessment:', error);
        res.status(500).json({ message: 'Server error fetching assessment' });
    }
});

// Create new assessment
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, category, questions } = req.body;
        
        const newAssessment = new Assessment({
            user: req.user.id,
            title,
            description,
            category,
            questions: questions || [],
            status: 'draft',
            scores: {
                d1: 0,
                d2: 0,
                d3: 0,
                d4: 0,
                overall: 0
            }
        });
        
        const savedAssessment = await newAssessment.save();
        res.status(201).json(savedAssessment);
    } catch (error) {
        console.error('Error creating assessment:', error);
        res.status(500).json({ message: 'Server error creating assessment' });
    }
});

// Update assessment
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, description, questions, scores, status } = req.body;
        
        const updatedAssessment = await Assessment.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { 
                $set: { 
                    title, 
                    description, 
                    questions, 
                    scores, 
                    status,
                    updatedAt: Date.now()
                } 
            },
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

// Delete assessment
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

// Calculate assessment scores
router.post('/:id/calculate-scores', auth, async (req, res) => {
    try {
        const assessment = await Assessment.findOne({ 
            _id: req.params.id, 
            user: req.user.id 
        });
        
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        
        // Calculate scores based on questions
        let d1Score = 0, d2Score = 0, d3Score = 0, d4Score = 0;
        let d1Count = 0, d2Count = 0, d3Count = 0, d4Count = 0;
        
        assessment.questions.forEach(question => {
            const score = question.userScore || 0;
            switch (question.dimension) {
                case 'D1':
                    d1Score += score;
                    d1Count++;
                    break;
                case 'D2':
                    d2Score += score;
                    d2Count++;
                    break;
                case 'D3':
                    d3Score += score;
                    d3Count++;
                    break;
                case 'D4':
                    d4Score += score;
                    d4Count++;
                    break;
            }
        });
        
        // Calculate averages
        const scores = {
            d1: d1Count > 0 ? Math.round((d1Score / d1Count) * 100) / 100 : 0,
            d2: d2Count > 0 ? Math.round((d2Score / d2Count) * 100) / 100 : 0,
            d3: d3Count > 0 ? Math.round((d3Score / d3Count) * 100) / 100 : 0,
            d4: d4Count > 0 ? Math.round((d4Score / d4Count) * 100) / 100 : 0
        };
        
        scores.overall = Math.round(((scores.d1 + scores.d2 + scores.d3 + scores.d4) / 4) * 100) / 100;
        
        // Update assessment with calculated scores
        assessment.scores = scores;
        assessment.status = 'completed';
        await assessment.save();
        
        res.json({
            assessment,
            scores
        });
    } catch (error) {
        console.error('Error calculating scores:', error);
        res.status(500).json({ message: 'Server error calculating scores' });
    }
});

module.exports = router;
