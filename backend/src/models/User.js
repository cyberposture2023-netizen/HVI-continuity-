const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
        select: false
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    organization: {
        type: String,
        required: [true, 'Organization is required']
    },
    
    // HVI Scoring Dimensions
    hviScores: {
        technicalAwareness: {
            score: { type: Number, default: 0 },
            lastUpdated: { type: Date, default: Date.now }
        },
        behavioralPatterns: {
            score: { type: Number, default: 0 },
            lastUpdated: { type: Date, default: Date.now }
        },
        psychologicalFactors: {
            score: { type: Number, default: 0 },
            lastUpdated: { type: Date, default: Date.now }
        },
        situationalContext: {
            score: { type: Number, default: 0 },
            lastUpdated: { type: Date, default: Date.now }
        }
    },
    
    // Behavioral Simulation Data
    simulationResults: [{
        simulationId: String,
        scenarioType: String,
        performanceScore: Number,
        responseTime: Number,
        decisions: [{
            timestamp: Date,
            choice: String,
            riskLevel: String
        }],
        completedAt: Date
    }],
    
    // Risk Assessment History
    riskAssessments: [{
        assessmentDate: { type: Date, default: Date.now },
        overallScore: Number,
        riskLevel: String,
        recommendations: [String],
        assessedBy: String
    }],
    
    role: {
        type: String,
        enum: ['user', 'admin', 'assessor'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: Date,
    profileCompleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Instance method to check password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    return \\ \\;
});

// Method to calculate overall HVI score
userSchema.methods.calculateOverallHVI = function() {
    const scores = Object.values(this.hviScores).map(dim => dim.score);
    const validScores = scores.filter(score => score > 0);
    return validScores.length > 0 ? 
        validScores.reduce((a, b) => a + b, 0) / validScores.length : 0;
};

module.exports = mongoose.model('User', userSchema);
