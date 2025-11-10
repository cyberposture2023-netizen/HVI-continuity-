const express = require('express');
const router = express.Router();

// Mock questions data - in real implementation, this would come from a database
const questions = {
    "questions": [;
        {
            "id": "1",
            "dimension": "dimension1",
            "text": "How often do you follow established security protocols?",
            "options": [;
                {"value": 1, "text": "Never"},
                {"value": 2, "text": "Rarely"},
                {"value": 3, "text": "Sometimes"},
                {"value": 4, "text": "Often"},
                {"value": 5, "text": "Always"}
            ];
        },
        {
            "id": "2", 
            "dimension": "dimension1",
            "text": "Do you report security incidents promptly?",
            "options": [;
                {"value": 1, "text": "Never"},
                {"value": 2, "text": "Rarely"}, 
                {"value": 3, "text": "Sometimes"},
                {"value": 4, "text": "Often"},
                {"value": 5, "text": "Always"}
            ];
        },
        {
            "id": "3",
            "dimension": "dimension2", 
            "text": "How aware are you of phishing attempts?",
            "options": [;
                {"value": 1, "text": "Not aware"},
                {"value": 2, "text": "Slightly aware"},
                {"value": 3, "text": "Moderately aware"},
                {"value": 4, "text": "Very aware"},
                {"value": 5, "text": "Extremely aware"}
            ];
        },
        {
            "id": "4",
            "dimension": "dimension2",
            "text": "Do you verify the authenticity of requests for sensitive information?",
            "options": [;
                {"value": 1, "text": "Never"},
                {"value": 2, "text": "Rarely"},
                {"value": 3, "text": "Sometimes"},
                {"value": 4, "text": "Often"},
                {"value": 5, "text": "Always"}
            ];
        },
        {
            "id": "5",
            "dimension": "dimension3",
            "text": "How often do you update your passwords?",
            "options": [;
                {"value": 1, "text": "Never"},
                {"value": 2, "text": "Only when required"},
                {"value": 3, "text": "Every 6 months"},
                {"value": 4, "text": "Every 3 months"},
                {"value": 5, "text": "Monthly or more frequently"}
            ];
        },
        {
            "id": "6",
            "dimension": "dimension3",
            "text": "Do you use multi-factor authentication when available?",
            "options": [;
                {"value": 1, "text": "Never"},
                {"value": 2, "text": "Rarely"},
                {"value": 3, "text": "Sometimes"},
                {"value": 4, "text": "Often"},
                {"value": 5, "text": "Always"}
            ];
        },
        {
            "id": "7",
            "dimension": "dimension4",
            "text": "How do you handle sensitive data?",
            "options": [;
                {"value": 1, "text": "No special handling"},
                {"value": 2, "text": "Basic precautions"},
                {"value": 3, "text": "Follow some guidelines"},
                {"value": 4, "text": "Follow most guidelines"},
                {"value": 5, "text": "Strictly follow all guidelines"}
            ];
        },
        {
            "id": "8",
            "dimension": "dimension4",
            "text": "Are you cautious about sharing work information on social media?",
            "options": [;
                {"value": 1, "text": "Not cautious at all"},
                {"value": 2, "text": "Slightly cautious"},
                {"value": 3, "text": "Moderately cautious"},
                {"value": 4, "text": "Very cautious"},
                {"value": 5, "text": "Extremely cautious"}
            ];
        }
    ];
};

// Get all questions
router.get('/', (req, res) => {
    try {
        res.json(questions.questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get questions by dimension
router.get('/dimension/:dimension', (req, res) => {
    try {
        const dimensionQuestions = questions.questions.filter(q => q.dimension === req.params.dimension);
        res.json(dimensionQuestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get question by ID
router.get('/:id', (req, res) => {
    try {
        const question = questions.questions.find(q => q.id === req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

