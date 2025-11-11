# Script 2: HVI Continuity Platform - Data Models and D1-D4 Scoring System
Write-Host "=== HVI Continuity Platform Restoration - Script 2/7 ===" -ForegroundColor Green

# Check if we're in the right directory
Write-Host "Current location: $(Get-Location)" -ForegroundColor Yellow

# Step 1: Create enhanced data models with D1-D4 scoring
Write-Host "1. Creating enhanced data models with D1-D4 scoring..." -ForegroundColor Yellow

# Create Assessment model with D1-D4 scoring
Write-Host "   Creating Assessment model..." -ForegroundColor Cyan
@'
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['D1', 'D2', 'D3', 'D4']
  },
  questionText: {
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
  }
});

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'HVI Continuity Assessment'
  },
  status: {
    type: String,
    enum: ['draft', 'in-progress', 'completed', 'submitted'],
    default: 'draft'
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    selectedOption: {
      score: Number,
      text: String
    },
    category: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  scores: {
    D1: {
      score: { type: Number, default: 0 },
      maxPossible: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
      maturity: { type: String, default: 'Not Assessed' }
    },
    D2: {
      score: { type: Number, default: 0 },
      maxPossible: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
      maturity: { type: String, default: 'Not Assessed' }
    },
    D3: {
      score: { type: Number, default: 0 },
      maxPossible: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
      maturity: { type: String, default: 'Not Assessed' }
    },
    D4: {
      score: { type: Number, default: 0 },
      maxPossible: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
      maturity: { type: String, default: 'Not Assessed' }
    },
    overall: {
      score: { type: Number, default: 0 },
      maxPossible: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
      maturity: { type: String, default: 'Not Assessed' }
    }
  },
  recommendations: [{
    category: String,
    priority: {
      type: String,
      enum: ['high', 'medium', 'low']
    },
    description: String,
    actionItems: [String]
  }],
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  submittedAt: Date
}, {
  timestamps: true
});

// Calculate scores before saving
assessmentSchema.methods.calculateScores = function() {
  const categoryScores = { D1: 0, D2: 0, D3: 0, D4: 0 };
  const categoryMaxScores = { D1: 0, D2: 0, D3: 0, D4: 0 };
  
  this.answers.forEach(answer => {
    if (answer.selectedOption && answer.category) {
      const weight = 1; // Default weight, could be enhanced
      categoryScores[answer.category] += answer.selectedOption.score * weight;
      categoryMaxScores[answer.category] += 4 * weight; // Max score per question is 4
    }
  });

  // Calculate percentages and maturity levels
  Object.keys(categoryScores).forEach(category => {
    const score = categoryScores[category];
    const maxScore = categoryMaxScores[category] || 1; // Avoid division by zero
    
    this.scores[category].score = score;
    this.scores[category].maxPossible = maxScore;
    this.scores[category].percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    this.scores[category].maturity = this.calculateMaturityLevel(this.scores[category].percentage);
  });

  // Calculate overall scores
  const totalScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0);
  const totalMaxScore = Object.values(categoryMaxScores).reduce((sum, max) => sum + max, 0);
  
  this.scores.overall.score = totalScore;
  this.scores.overall.maxPossible = totalMaxScore;
  this.scores.overall.percentage = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
  this.scores.overall.maturity = this.calculateMaturityLevel(this.scores.overall.percentage);
};

// Calculate maturity level based on percentage
assessmentSchema.methods.calculateMaturityLevel = function(percentage) {
  if (percentage >= 90) return 'Optimized (D4)';
  if (percentage >= 75) return 'Advanced (D3)';
  if (percentage >= 50) return 'Developing (D2)';
  if (percentage >= 25) return 'Foundational (D1)';
  return 'Not Assessed';
};

// Generate recommendations based on scores
assessmentSchema.methods.generateRecommendations = function() {
  this.recommendations = [];
  
  Object.keys(this.scores).forEach(category => {
    if (category === 'overall') return;
    
    const categoryScore = this.scores[category];
    
    if (categoryScore.percentage < 50) {
      this.recommendations.push({
        category: category,
        priority: 'high',
        description: `Improve ${category} capabilities from current ${categoryScore.maturity} level`,
        actionItems: [
          `Conduct ${category} capability assessment`,
          `Develop ${category} improvement plan`,
          `Implement ${category} best practices`
        ]
      });
    } else if (categoryScore.percentage < 75) {
      this.recommendations.push({
        category: category,
        priority: 'medium',
        description: `Enhance ${category} capabilities to reach next maturity level`,
        actionItems: [
          `Review ${category} current practices`,
          `Identify ${category} enhancement opportunities`,
          `Plan ${category} optimization initiatives`
        ]
      });
    }
  });
};

module.exports = mongoose.model('Assessment', assessmentSchema);
'@ | Out-File -FilePath "backend\models\Assessment.js" -Encoding UTF8

Write-Host "   Assessment model created with D1-D4 scoring" -ForegroundColor Green

# Create User model
Write-Host "   Creating User model..." -ForegroundColor Cyan
@'
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  organization: {
    type: String,
    required: true
  },
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
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    reports: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
'@ | Out-File -FilePath "backend\models\User.js" -Encoding UTF8

Write-Host "   User model created" -ForegroundColor Green

# Create Question model
Write-Host "   Creating Question model..." -ForegroundColor Cyan
@'
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
'@ | Out-File -FilePath "backend\models\Question.js" -Encoding UTF8

Write-Host "   Question model created" -ForegroundColor Green

# Step 2: Create sample questions data
Write-Host "2. Creating sample questions data..." -ForegroundColor Yellow
@'
const mongoose = require('mongoose');
const Question = require('../models/Question');

const sampleQuestions = [
  // D1 - Foundational Capabilities
  {
    category: 'D1',
    subcategory: 'Basic Infrastructure',
    questionText: 'Does your organization have documented emergency response procedures?',
    description: 'Assessment of basic emergency response documentation and procedures',
    options: [
      { score: 0, text: 'No documented procedures', description: 'No formal documentation exists' },
      { score: 1, text: 'Basic informal procedures', description: 'Some informal guidelines but not documented' },
      { score: 2, text: 'Partially documented', description: 'Some procedures are documented but incomplete' },
      { score: 3, text: 'Fully documented', description: 'Comprehensive documentation exists' },
      { score: 4, text: 'Documented and regularly reviewed', description: 'Documentation is maintained and regularly updated' }
    ],
    weight: 1.2,
    required: true,
    order: 1
  },
  {
    category: 'D1',
    subcategory: 'Resource Management',
    questionText: 'Are essential resources identified and available for emergency situations?',
    description: 'Evaluation of resource identification and availability',
    options: [
      { score: 0, text: 'No resources identified', description: 'No resource planning in place' },
      { score: 1, text: 'Limited resource awareness', description: 'Some awareness but no formal inventory' },
      { score: 2, text: 'Basic resource inventory', description: 'Partial inventory exists' },
      { score: 3, text: 'Comprehensive inventory', description: 'Complete resource inventory maintained' },
      { score: 4, text: 'Inventory with availability tracking', description: 'Real-time tracking of resource availability' }
    ],
    weight: 1.1,
    required: true,
    order: 2
  },

  // D2 - Developing Capabilities
  {
    category: 'D2',
    subcategory: 'Training & Awareness',
    questionText: 'Is staff training conducted regularly for emergency procedures?',
    description: 'Assessment of training frequency and effectiveness',
    options: [
      { score: 0, text: 'No training conducted', description: 'No formal training program' },
      { score: 1, text: 'Occasional informal training', description: 'Infrequent and informal training sessions' },
      { score: 2, text: 'Regular basic training', description: 'Scheduled basic training sessions' },
      { score: 3, text: 'Comprehensive training program', description: 'Structured training with assessments' },
      { score: 4, text: 'Advanced simulation training', description: 'Regular drills and simulation exercises' }
    ],
    weight: 1.3,
    required: true,
    order: 1
  },
  {
    category: 'D2',
    subcategory: 'Communication Systems',
    questionText: 'How effective are your emergency communication systems?',
    description: 'Evaluation of communication infrastructure and protocols',
    options: [
      { score: 0, text: 'No communication system', description: 'No established communication protocols' },
      { score: 1, text: 'Basic communication methods', description: 'Limited communication capabilities' },
      { score: 2, text: 'Multiple communication channels', description: 'Several communication methods available' },
      { score: 3, text: 'Integrated communication system', description: 'Coordinated communication approach' },
      { score: 4, text: 'Redundant robust systems', description: 'Multiple redundant systems with failover' }
    ],
    weight: 1.4,
    required: true,
    order: 2
  },

  // D3 - Advanced Capabilities
  {
    category: 'D3',
    subcategory: 'Technology Integration',
    questionText: 'Are advanced technologies integrated into your continuity planning?',
    description: 'Assessment of technology adoption in continuity processes',
    options: [
      { score: 0, text: 'No technology integration', description: 'Manual processes only' },
      { score: 1, text: 'Basic technology use', description: 'Limited technology adoption' },
      { score: 2, text: 'Moderate integration', description: 'Some systems integrated' },
      { score: 3, text: 'Advanced system integration', description: 'Comprehensive technology integration' },
      { score: 4, text: 'Cutting-edge solutions', description: 'Latest technologies with AI/ML capabilities' }
    ],
    weight: 1.5,
    required: false,
    order: 1
  },
  {
    category: 'D3',
    subcategory: 'Risk Assessment',
    questionText: 'How comprehensive is your risk assessment process?',
    description: 'Evaluation of risk identification and analysis methods',
    options: [
      { score: 0, text: 'No formal risk assessment', description: 'No systematic risk evaluation' },
      { score: 1, text: 'Basic risk identification', description: 'Informal risk awareness' },
      { score: 2, text: 'Structured risk assessment', description: 'Regular risk evaluation process' },
      { score: 3, text: 'Comprehensive risk analysis', description: 'Detailed risk analysis with metrics' },
      { score: 4, text: 'Predictive risk modeling', description: 'Advanced predictive analytics and modeling' }
    ],
    weight: 1.6,
    required: true,
    order: 2
  },

  // D4 - Optimized Capabilities
  {
    category: 'D4',
    subcategory: 'Continuous Improvement',
    questionText: 'Is there a continuous improvement process for continuity capabilities?',
    description: 'Assessment of improvement cycles and optimization',
    options: [
      { score: 0, text: 'No improvement process', description: 'Static processes without review' },
      { score: 1, text: 'Occasional reviews', description: 'Infrequent process evaluation' },
      { score: 2, text: 'Regular assessment cycles', description: 'Scheduled review processes' },
      { score: 3, text: 'Structured improvement program', description: 'Formal improvement initiatives' },
      { score: 4, text: 'Optimization with metrics', description: 'Data-driven continuous optimization' }
    ],
    weight: 1.7,
    required: false,
    order: 1
  },
  {
    category: 'D4',
    subcategory: 'Innovation & Leadership',
    questionText: 'How does leadership drive innovation in continuity management?',
    description: 'Evaluation of leadership commitment and innovation culture',
    options: [
      { score: 0, text: 'No leadership involvement', description: 'Minimal executive support' },
      { score: 1, text: 'Basic leadership awareness', description: 'Some executive awareness' },
      { score: 2, text: 'Active leadership support', description: 'Regular executive engagement' },
      { score: 3, text: 'Strategic leadership commitment', description: 'Executive-driven initiatives' },
      { score: 4, text: 'Innovation-focused leadership', description: 'Leadership drives continuous innovation' }
    ],
    weight: 1.8,
    required: false,
    order: 2
  }
];

const seedQuestions = async () => {
  try {
    // Clear existing questions
    await Question.deleteMany({});
    
    // Insert sample questions
    await Question.insertMany(sampleQuestions);
    
    console.log('Sample questions seeded successfully');
    console.log(`Seeded ${sampleQuestions.length} questions across D1-D4 categories`);
    
    // Log category counts
    const d1Count = sampleQuestions.filter(q => q.category === 'D1').length;
    const d2Count = sampleQuestions.filter(q => q.category === 'D2').length;
    const d3Count = sampleQuestions.filter(q => q.category === 'D3').length;
    const d4Count = sampleQuestions.filter(q => q.category === 'D4').length;
    
    console.log(`Category breakdown: D1: ${d1Count}, D2: ${d2Count}, D3: ${d3Count}, D4: ${d4Count}`);
    
  } catch (error) {
    console.error('Error seeding questions:', error);
  }
};

module.exports = { sampleQuestions, seedQuestions };
'@ | Out-File -FilePath "backend\data\questions.js" -Encoding UTF8

Write-Host "   Sample questions data created" -ForegroundColor Green

# Step 3: Create scoring utilities
Write-Host "3. Creating scoring utilities..." -ForegroundColor Yellow
@'
// D1-D4 Scoring Utilities
class ScoringEngine {
  static calculateCategoryScores(answers, questions) {
    const categoryScores = {
      D1: { score: 0, maxPossible: 0, percentage: 0, maturity: '' },
      D2: { score: 0, maxPossible: 0, percentage: 0, maturity: '' },
      D3: { score: 0, maxPossible: 0, percentage: 0, maturity: '' },
      D4: { score: 0, maxPossible: 0, percentage: 0, maturity: '' }
    };

    answers.forEach(answer => {
      const question = questions.find(q => q._id.toString() === answer.questionId.toString());
      if (question && answer.selectedOption) {
        const category = question.category;
        const weight = question.weight || 1;
        const questionMaxScore = 4 * weight; // Max score per question is 4
        
        categoryScores[category].score += answer.selectedOption.score * weight;
        categoryScores[category].maxPossible += questionMaxScore;
      }
    });

    // Calculate percentages and maturity levels
    Object.keys(categoryScores).forEach(category => {
      const scoreData = categoryScores[category];
      scoreData.percentage = scoreData.maxPossible > 0 
        ? (scoreData.score / scoreData.maxPossible) * 100 
        : 0;
      scoreData.maturity = this.getMaturityLevel(scoreData.percentage);
    });

    return categoryScores;
  }

  static calculateOverallScore(categoryScores) {
    const totalScore = Object.values(categoryScores).reduce((sum, cat) => sum + cat.score, 0);
    const totalMaxPossible = Object.values(categoryScores).reduce((sum, cat) => sum + cat.maxPossible, 0);
    
    const overallPercentage = totalMaxPossible > 0 ? (totalScore / totalMaxPossible) * 100 : 0;
    
    return {
      score: totalScore,
      maxPossible: totalMaxPossible,
      percentage: overallPercentage,
      maturity: this.getMaturityLevel(overallPercentage)
    };
  }

  static getMaturityLevel(percentage) {
    if (percentage >= 90) return 'Optimized (D4)';
    if (percentage >= 75) return 'Advanced (D3)';
    if (percentage >= 50) return 'Developing (D2)';
    if (percentage >= 25) return 'Foundational (D1)';
    return 'Not Assessed';
  }

  static generateRecommendations(categoryScores) {
    const recommendations = [];
    
    Object.keys(categoryScores).forEach(category => {
      const score = categoryScores[category];
      
      if (score.percentage < 50) {
        recommendations.push({
          category,
          priority: 'high',
          title: `Improve ${category} Capabilities`,
          description: `Current ${category} maturity level is ${score.maturity}. Focus on building foundational capabilities.`,
          actionItems: [
            `Conduct ${category} capability assessment`,
            `Develop ${category} improvement roadmap`,
            `Implement basic ${category} processes`,
            `Train staff on ${category} fundamentals`
          ]
        });
      } else if (score.percentage < 75) {
        recommendations.push({
          category,
          priority: 'medium',
          title: `Enhance ${category} Capabilities`,
          description: `Current ${category} maturity level is ${score.maturity}. Work on developing advanced capabilities.`,
          actionItems: [
            `Review current ${category} practices`,
            `Identify ${category} enhancement opportunities`,
            `Implement best practices for ${category}`,
            `Conduct advanced ${category} training`
          ]
        });
      } else if (score.percentage < 90) {
        recommendations.push({
          category,
          priority: 'low',
          title: `Optimize ${category} Capabilities`,
          description: `Current ${category} maturity level is ${score.maturity}. Focus on optimization and innovation.`,
          actionItems: [
            `Benchmark ${category} against industry standards`,
            `Implement continuous improvement for ${category}`,
            `Explore innovative ${category} solutions`,
            `Establish ${category} excellence metrics`
          ]
        });
      }
    });

    return recommendations;
  }

  static getMaturityDescription(maturityLevel) {
    const descriptions = {
      'Not Assessed': 'No assessment completed or insufficient data',
      'Foundational (D1)': 'Basic capabilities established, fundamental processes in place',
      'Developing (D2)': 'Developing capabilities, structured processes being implemented',
      'Advanced (D3)': 'Advanced capabilities, well-established and effective processes',
      'Optimized (D4)': 'Optimized capabilities, continuous improvement and innovation'
    };
    
    return descriptions[maturityLevel] || 'Unknown maturity level';
  }
}

module.exports = ScoringEngine;
'@ | Out-File -FilePath "backend\utils\scoringEngine.js" -Encoding UTF8

Write-Host "   Scoring utilities created" -ForegroundColor Green

Write-Host "=== Script 2 Complete ===" -ForegroundColor Green
Write-Host "Data models and D1-D4 scoring system implemented successfully!" -ForegroundColor Green
Write-Host "Next: Run Script 3 to implement the missing endpoints and controllers" -ForegroundColor Yellow