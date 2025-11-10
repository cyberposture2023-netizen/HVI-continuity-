const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Assessment = require('../models/Assessment');
const auth = require('../middleware/auth');

// GET /api/questions/assessment/:assessmentId - Get questions for assessment
router.get('/assessment/:assessmentId', auth, async (req, res) => {
    try {
        const assessment = await Assessment.findOne({
            _id: req.params.assessmentId,
            user: req.user.id
        });
        
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        
        const questions = await Question.find({ _id: { $in: assessment.questions } });
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Server error fetching questions' });
    }
});

// POST /api/questions - Create new question
router.post('/', auth, async (req, res) => {
    try {
        const { text, options, correctAnswer, category, explanation } = req.body;
        
        const newQuestion = new Question({
            text,
            options,
            correctAnswer,
            category,
            explanation
        });
        
        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ message: 'Server error creating question' });
    }
});

// PUT /api/questions/:id - Update question
router.put('/:id', auth, async (req, res) => {
    try {
        const { text, options, correctAnswer, category, explanation } = req.body;
        
        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.id,
            { text, options, correctAnswer, category, explanation },
            { new: true }
        );
        
        if (!updatedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }
        
        res.json(updatedQuestion);
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ message: 'Server error updating question' });
    }
});

// DELETE /api/questions/:id - Delete question
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
        
        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }
        
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ message: 'Server error deleting question' });
    }
});

// Test route for health checks
router.get('/test/health', (req, res) => {
    res.json({ status: 'ok', message: 'Questions route working' });
});

module.exports = router;
