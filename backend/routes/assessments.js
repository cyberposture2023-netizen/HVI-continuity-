const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const User = require('../models/User');

// Get all assessments
router.get('/', async (req, res) => {
    try {
        const assessments = await Assessment.find().populate('user');
        res.json(assessments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get assessment by ID
router.get('/:id', async (req, res) => {
    try {
        const assessment = await Assessment.findById(req.params.id).populate('user');
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        res.json(assessment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new assessment
router.post('/', async (req, res) => {
    try {
        const assessment = new Assessment(req.body);
        const savedAssessment = await assessment.save();
        
        // Update user's assessment history
        if (req.body.userId) {
            await User.findByIdAndUpdate(req.body.userId, {
                $push: { assessmentHistory: savedAssessment._id }
            });
        }
        
        res.status(201).json(savedAssessment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Submit assessment answers and calculate scores
router.post('/:id/submit', async (req, res) => {
    try {
        const { answers, userId } = req.body;
        
        const assessment = await Assessment.findById(req.params.id);
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        
        // Calculate scores
        const scores = calculateDimensionScores(answers);
        const hviScore = calculateHVIScore(scores);
        
        // Update assessment
        assessment.answers = answers;
        assessment.scores = scores;
        assessment.hviScore = hviScore;
        assessment.completedAt = new Date();
        assessment.status = 'completed';
        
        const updatedAssessment = await assessment.save();
        
        // Update user's current assessment and scores
        if (userId) {
            await User.findByIdAndUpdate(userId, {
                currentAssessment: updatedAssessment._id,
                lastAssessmentDate: new Date(),
                $set: {
                    'scores.dimension1': scores.dimension1,
                    'scores.dimension2': scores.dimension2,
                    'scores.dimension3': scores.dimension3,
                    'scores.dimension4': scores.dimension4,
                    'scores.overall': hviScore
                }
            });
        }
        
        res.json({
            assessment: updatedAssessment,
            scores: scores,
            hviScore: hviScore
        });
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get user's assessments
router.get('/user/:userId', async (req, res) => {
    try {
        const assessments = await Assessment.find({ user: req.params.userId })
            .sort({ completedAt: -1 });
        res.json(assessments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Score calculation functions
function calculateDimensionScores(answers) {
    const scores = { dimension1: 0, dimension2: 0, dimension3: 0, dimension4: 0 };
    const counts = { dimension1: 0, dimension2: 0, dimension3: 0, dimension4: 0 };
    
    answers.forEach(answer => {
        const dimension = answer.dimension;
        if (scores[dimension] !== undefined) {
            scores[dimension] += answer.score || 0;
            counts[dimension]++;
        }
    });
    
    // Calculate averages
    Object.keys(scores).forEach(dimension => {
        if (counts[dimension] > 0) {
            scores[dimension] = Math.round((scores[dimension] / counts[dimension]) * 10) / 10;
        }
    });
    
    return scores;
}

function calculateHVIScore(dimensionScores) {
    const weights = {
        dimension1: 0.25,
        dimension2: 0.25, 
        dimension3: 0.25,
        dimension4: 0.25
    };
    
    let weightedSum = 0;
    Object.keys(dimensionScores).forEach(dimension => {
        weightedSum += dimensionScores[dimension] * weights[dimension];
    });
    
    return Math.round(weightedSum * 10) / 10;
}

module.exports = router;
