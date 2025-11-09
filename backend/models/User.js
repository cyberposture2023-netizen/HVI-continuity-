const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, default: 'General' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  
  // HVI Scores
  overallHVI: { type: Number, default: 0 },
  d1Score: { type: Number, default: 0 }, // Behavioral
  d2Score: { type: Number, default: 0 }, // Technical  
  d3Score: { type: Number, default: 0 }, // Organizational
  d4Score: { type: Number, default: 0 }, // Environmental
  
  // Assessment tracking
  lastAssessmentDate: { type: Date },
  assessmentCount: { type: Number, default: 0 },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
