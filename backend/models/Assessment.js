const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['behavioral', 'technical', 'compliance', 'comprehensive']
    },
    status: {
        type: String,
        enum: ['draft', 'in-progress', 'completed'],
        default: 'draft'
    },
    questions: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        },
        text: String,
        dimension: {
            type: String,
            enum: ['D1', 'D2', 'D3', 'D4']
        },
        category: String,
        options: [{
            text: String,
            value: Number
        }],
        userAnswer: String,
        userScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        answeredAt: Date
    }],
    scores: {
        d1: { type: Number, default: 0 },
        d2: { type: Number, default: 0 },
        d3: { type: Number, default: 0 },
        d4: { type: Number, default: 0 },
        overall: { type: Number, default: 0 }
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for better query performance
assessmentSchema.index({ user: 1, createdAt: -1 });
assessmentSchema.index({ status: 1 });

// Method to calculate scores
assessmentSchema.methods.calculateScores = function() {
    let d1Score = 0, d2Score = 0, d3Score = 0, d4Score = 0;
    let d1Count = 0, d2Count = 0, d3Count = 0, d4Count = 0;
    
    this.questions.forEach(question => {
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
    
    this.scores = {
        d1: d1Count > 0 ? Math.round((d1Score / d1Count) * 100) / 100 : 0,
        d2: d2Count > 0 ? Math.round((d2Score / d2Count) * 100) / 100 : 0,
        d3: d3Count > 0 ? Math.round((d3Score / d3Count) * 100) / 100 : 0,
        d4: d4Count > 0 ? Math.round((d4Score / d4Count) * 100) / 100 : 0
    };
    
    this.scores.overall = Math.round(((this.scores.d1 + this.scores.d2 + this.scores.d3 + this.scores.d4) / 4) * 100) / 100;
    
    if (this.questions.length > 0 && this.questions.every(q => q.userScore !== undefined)) {
        this.status = 'completed';
        this.completedAt = new Date();
    }
    
    return this.scores;
};

module.exports = mongoose.model('Assessment', assessmentSchema);
