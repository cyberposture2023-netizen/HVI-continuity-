const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assessorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assessmentType: {
        type: String,
        enum: ['initial', 'periodic', 'incident', 'simulation'],
        required: true
    },
    
    // 4D Dimension Scores
    dimensionScores: {
        technicalAwareness: {
            score: { type: Number, required: true, min: 0, max: 100 },
            factors: [{
                category: String,
                score: Number,
                weight: Number,
                evidence: [String]
            }]
        },
        behavioralPatterns: {
            score: { type: Number, required: true, min: 0, max: 100 },
            factors: [{
                category: String,
                score: Number,
                weight: Number,
                observations: [String]
            }]
        },
        psychologicalFactors: {
            score: { type: Number, required: true, min: 0, max: 100 },
            factors: [{
                category: String,
                score: Number,
                weight: Number,
                indicators: [String]
            }]
        },
        situationalContext: {
            score: { type: Number, required: true, min: 0, max: 100 },
            factors: [{
                category: String,
                score: Number,
                weight: Number,
                context: [String]
            }]
        }
    },
    
    overallScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    
    riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
    },
    
    recommendations: [{
        category: String,
        priority: { type: String, enum: ['low', 'medium', 'high'] },
        action: String,
        timeline: String,
        resources: [String]
    }],
    
    simulationData: {
        completed: { type: Boolean, default: false },
        scenarios: [{
            scenarioId: String,
            score: Number,
            responses: [{
                questionId: String,
                answer: mongoose.Schema.Types.Mixed,
                timestamp: Date
            }]
        }]
    },
    
    status: {
        type: String,
        enum: ['draft', 'in-progress', 'completed', 'reviewed'],
        default: 'draft'
    },
    
    notes: String,
    nextAssessmentDate: Date
    
}, {
    timestamps: true
});

// Calculate overall score before saving
assessmentSchema.pre('save', function(next) {
    const scores = [
        this.dimensionScores.technicalAwareness.score,
        this.dimensionScores.behavioralPatterns.score,
        this.dimensionScores.psychologicalFactors.score,
        this.dimensionScores.situationalContext.score
    ];
    
    this.overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    // Determine risk level based on overall score
    if (this.overallScore >= 80) this.riskLevel = 'critical';
    else if (this.overallScore >= 60) this.riskLevel = 'high';
    else if (this.overallScore >= 40) this.riskLevel = 'medium';
    else this.riskLevel = 'low';
    
    next();
});

module.exports = mongoose.model('Assessment', assessmentSchema);
