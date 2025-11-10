const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Assessment = require('../models/Assessment');
const auth = require('../middleware/auth');

// Get all questions (for admin or specific assessments)
router.get('/', auth, async (req, res) => {
    try {
        const { assessmentId, dimension, category } = req.query;
        
        let query = {};
        if (assessmentId) {
            query.assessment = assessmentId;
        }
        if (dimension) {
            query.dimension = dimension;
        }
        if (category) {
            query.category = category;
        }
        
        const questions = await Question.find(query).sort({ order: 1 });
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Server error fetching questions' });
    }
});

// Get question by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        
        res.json(question);
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ message: 'Server error fetching question' });
    }
});

// Create new question (admin only)
router.post('/', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
        const { 
            text, 
            dimension, 
            category, 
            options, 
            correctAnswer, 
            explanation,
            order,
            weight 
        } = req.body;
        
        const newQuestion = new Question({
            text,
            dimension,
            category,
            options: options || [],
            correctAnswer,
            explanation,
            order: order || 0,
            weight: weight || 1,
            createdBy: req.user.id
        });
        
        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ message: 'Server error creating question' });
    }
});

// Update question (admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
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

// Delete question (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
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

// Submit answer for a question in an assessment
router.post('/:id/answer', auth, async (req, res) => {
    try {
        const { assessmentId, userAnswer, userScore } = req.body;
        const questionId = req.params.id;
        
        // Find the assessment
        const assessment = await Assessment.findOne({ 
            _id: assessmentId, 
            user: req.user.id 
        });
        
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        
        // Update or add the question in assessment
        const questionIndex = assessment.questions.findIndex(
            q => q.questionId.toString() === questionId
        );
        
        if (questionIndex > -1) {
            // Update existing question
            assessment.questions[questionIndex].userAnswer = userAnswer;
            assessment.questions[questionIndex].userScore = userScore;
            assessment.questions[questionIndex].answeredAt = new Date();
        } else {
            // Add new question to assessment
            const question = await Question.findById(questionId);
            if (!question) {
                return res.status(404).json({ message: 'Question not found' });
            }
            
            assessment.questions.push({
                questionId: question._id,
                text: question.text,
                dimension: question.dimension,
                category: question.category,
                options: question.options,
                userAnswer,
                userScore,
                answeredAt: new Date()
            });
        }
        
        await assessment.save();
        
        res.json({ 
            message: 'Answer submitted successfully',
            assessment 
        });
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({ message: 'Server error submitting answer' });
    }
});

module.exports = router;
