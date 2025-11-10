const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    dimension: {
        type: String,
        required: true,
        enum: ['D1', 'D2', 'D3', 'D4']
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    options: [{
        text: {
            type: String,
            required: true
        },
        value: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        explanation: {
            type: String,
            trim: true
        }
    }],
    correctAnswer: {
        type: String,
        trim: true
    },
    explanation: {
        type: String,
        trim: true
    },
    order: {
        type: Number,
        default: 0
    },
    weight: {
        type: Number,
        default: 1,
        min: 0.1,
        max: 5
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for better query performance
questionSchema.index({ dimension: 1, category: 1 });
questionSchema.index({ isActive: 1 });

// Static method to get questions by dimension and category
questionSchema.statics.getByDimension = function(dimension, category = null) {
    const query = { dimension, isActive: true };
    if (category) {
        query.category = category;
    }
    return this.find(query).sort({ order: 1 });
};

// Instance method to validate answer
questionSchema.methods.validateAnswer = function(userAnswer) {
    if (!this.correctAnswer) return { isValid: true, score: 50 }; // Default score if no correct answer
    
    const isCorrect = userAnswer === this.correctAnswer;
    const correctOption = this.options.find(opt => opt.text === this.correctAnswer);
    const score = isCorrect ? (correctOption?.value || 100) : 0;
    
    return {
        isValid: true,
        isCorrect,
        score,
        explanation: this.explanation
    };
};

module.exports = mongoose.model('Question', questionSchema);
