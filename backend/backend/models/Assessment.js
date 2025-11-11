const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  answer: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const assessmentSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  organizationName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  currentSection: {
    type: String,
    default: null
  },
  responses: [responseSchema],
  scores: {
    overall: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    dimensions: {
      d1: { type: Number, default: 0, min: 0, max: 100 },
      d2: { type: Number, default: 0, min: 0, max: 100 },
      d3: { type: Number, default: 0, min: 0, max: 100 },
      d4: { type: Number, default: 0, min: 0, max: 100 }
    },
    domains: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
});

assessmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set completedAt if status changed to completed
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Assessment', assessmentSchema);
