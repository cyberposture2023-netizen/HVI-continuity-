const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['D1', 'D2', 'D3', 'D4']
  },
  subcategory: {
    type: String,
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  options: [{
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 4
    },
    text: {
      type: String,
      required: true
    },
    description: String
  }],
  weight: {
    type: Number,
    default: 1,
    min: 0.1,
    max: 3
  },
  required: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  metadata: {
    references: [String],
    tags: [String],
    version: {
      type: String,
      default: '1.0'
    }
  }
}, {
  timestamps: true
});

// Static method to get questions by category
questionSchema.statics.getByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ order: 1 });
};

// Static method to get all active questions
questionSchema.statics.getActiveQuestions = function() {
  return this.find({ isActive: true }).sort({ category: 1, order: 1 });
};

module.exports = mongoose.model('Question', questionSchema);
