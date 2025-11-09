const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessmentType: {
    type: String,
    enum: ['full', 'quick', 'department'],
    default: 'full'
  },
  department: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  completionDate: {
    type: Date
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100
  },
  dimensions: {
    behavioral: {
      score: { type: Number, default: 0, min: 0, max: 100 },
      answers: [{
        questionId: String,
        questionText: String,
        selectedOption: String,
        score: Number,
        answeredAt: { type: Date, default: Date.now }
      }],
      completedAt: Date
    },
    technical: {
      score: { type: Number, default: 0, min: 0, max: 100 },
      answers: [{
        questionId: String,
        questionText: String,
        selectedOption: String,
        score: Number,
        answeredAt: { type: Date, default: Date.now }
      }],
      completedAt: Date
    },
    organizational: {
      score: { type: Number, default: 0, min: 0, max: 100 },
      answers: [{
        questionId: String,
        questionText: String,
        selectedOption: String,
        score: Number,
        answeredAt: { type: Date, default: Date.now }
      }],
      completedAt: Date
    },
    environmental: {
      score: { type: Number, default: 0, min: 0, max: 100 },
      answers: [{
        questionId: String,
        questionText: String,
        selectedOption: String,
        score: Number,
        answeredAt: { type: Date, default: Date.now }
      }],
      completedAt: Date
    }
  },
  recommendations: [{
    dimension: String,
    title: String,
    description: String,
    priority: { type: String, enum: ['low', 'medium', 'high'] },
    actionSteps: [String]
  }]
}, {
  timestamps: true
});

// Index for faster queries
assessmentSchema.index({ userId: 1, startDate: -1 });
assessmentSchema.index({ department: 1, status: 1 });

module.exports = mongoose.model('Assessment', assessmentSchema);
