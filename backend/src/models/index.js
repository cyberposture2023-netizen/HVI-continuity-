const mongoose = require('mongoose');

// Enhanced HVI Scoring Algorithm Schema
const HVIScoringSchema = new mongoose.Schema({
  behavioralRisk: {
    phishingSusceptibility: { type: Number, min: 0, max: 100, default: 0 },
    socialEngineeringRisk: { type: Number, min: 0, max: 100, default: 0 },
    passwordHygiene: { type: Number, min: 0, max: 100, default: 0 },
    dataHandlingRisk: { type: Number, min: 0, max: 100, default: 0 }
  },
  technicalRisk: {
    deviceSecurity: { type: Number, min: 0, max: 100, default: 0 },
    softwareCompliance: { type: Number, min: 0, max: 100, default: 0 },
    networkSecurity: { type: Number, min: 0, max: 100, default: 0 },
    accessControl: { type: Number, min: 0, max: 100, default: 0 }
  },
  organizationalRisk: {
    policyCompliance: { type: Number, min: 0, max: 100, default: 0 },
    trainingCompletion: { type: Number, min: 0, max: 100, default: 0 },
    incidentResponse: { type: Number, min: 0, max: 100, default: 0 },
    securityAwareness: { type: Number, min: 0, max: 100, default: 0 }
  },
  environmentalRisk: {
    remoteWorkRisk: { type: Number, min: 0, max: 100, default: 0 },
    physicalSecurity: { type: Number, min: 0, max: 100, default: 0 },
    thirdPartyRisk: { type: Number, min: 0, max: 100, default: 0 },
    complianceRisk: { type: Number, min: 0, max: 100, default: 0 }
  },
  overallHVI: { type: Number, min: 0, max: 100, default: 0 },
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Low' },
  lastCalculated: { type: Date, default: Date.now }
});

// Enhanced User Schema with HVI Integration
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'assessor'], default: 'user' },
  
  // HVI-Specific Fields
  hviProfile: {
    department: { type: String, required: true },
    jobRole: { type: String, required: true },
    accessLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Low' },
    sensitivityLevel: { type: String, enum: ['Public', 'Internal', 'Confidential', 'Restricted'], default: 'Internal' },
    
    // Behavioral Metrics
    behavioralMetrics: {
      simulatedPhishingResults: [{
        testId: String,
        date: Date,
        clicked: Boolean,
        reported: Boolean,
        responseTime: Number
      }],
      trainingScores: [{
        module: String,
        score: Number,
        completionDate: Date
      }],
      policyAcknowledgements: [{
        policyId: String,
        acknowledged: Boolean,
        date: Date
      }]
    },
    
    // Current HVI Score
    currentHVI: HVIScoringSchema,
    
    // HVI History
    hviHistory: [{
      score: HVIScoringSchema,
      calculatedAt: Date,
      assessmentId: mongoose.Schema.Types.ObjectId
    }],
    
    // Risk Mitigation Actions
    mitigationActions: [{
      actionId: String,
      description: String,
      assignedDate: Date,
      dueDate: Date,
      status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Overdue'], default: 'Pending' },
      impactScore: Number
    }]
  },
  
  profile: {
    firstName: String,
    lastName: String,
    phone: String
  },
  
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Enhanced Assessment Schema
const AssessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { 
    type: String, 
    enum: ['Behavioral', 'Technical', 'Organizational', 'Environmental', 'Comprehensive'],
    required: true 
  },
  
  // Assessment Configuration
  configuration: {
    scoringAlgorithm: { type: String, default: 'Advanced_HVI_v2' },
    weightings: {
      behavioral: { type: Number, min: 0, max: 1, default: 0.4 },
      technical: { type: Number, min: 0, max: 1, default: 0.3 },
      organizational: { type: Number, min: 0, max: 1, default: 0.2 },
      environmental: { type: Number, min: 0, max: 1, default: 0.1 }
    },
    thresholds: {
      lowRisk: { type: Number, min: 0, max: 100, default: 25 },
      mediumRisk: { type: Number, min: 0, max: 100, default: 50 },
      highRisk: { type: Number, min: 0, max: 100, default: 75 }
    }
  },
  
  // Assessment Questions and Structure
  sections: [{
    sectionId: String,
    title: String,
    description: String,
    weight: Number,
    questions: [{
      questionId: String,
      text: String,
      type: { type: String, enum: ['multiple_choice', 'likert', 'behavioral', 'technical'] },
      options: [{
        value: String,
        score: Number,
        riskFactor: String
      }],
      riskCategory: String,
      maxScore: Number
    }]
  }],
  
  // Assessment Results
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startedAt: Date,
    completedAt: Date,
    responses: [{
      questionId: String,
      answer: mongoose.Schema.Types.Mixed,
      score: Number,
      riskFactors: [String]
    }],
    sectionScores: mongoose.Schema.Types.Mixed,
    finalScore: HVIScoringSchema,
    recommendations: [String]
  }],
  
  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  startDate: Date,
  endDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Simulation Scenario Schema
const SimulationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Phishing', 'Social Engineering', 'Data Handling', 'Physical Security', 'Incident Response'],
    required: true 
  },
  description: String,
  scenario: mongoose.Schema.Types.Mixed, // Flexible scenario data
  targetGroup: [{
    department: String,
    role: String,
    accessLevel: String
  }],
  
  // Simulation Configuration
  configuration: {
    duration: Number, // in hours
    successCriteria: mongoose.Schema.Types.Mixed,
    scoringMatrix: mongoose.Schema.Types.Mixed
  },
  
  // Results and Analytics
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startTime: Date,
    endTime: Date,
    actions: [{
      timestamp: Date,
      action: String,
      outcome: String,
      scoreImpact: Number
    }],
    finalScore: Number,
    riskIndicators: [String],
    behavioralInsights: mongoose.Schema.Types.Mixed
  }],
  
  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['Draft', 'Scheduled', 'Running', 'Completed', 'Archived'], 
    default: 'Draft' 
  },
  scheduledStart: Date,
  scheduledEnd: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// HVI Scoring Engine Methods
HVIScoringSchema.methods.calculateOverallHVI = function() {
  const weights = {
    behavioral: 0.4,
    technical: 0.3,
    organizational: 0.2,
    environmental: 0.1
  };
  
  const behavioralAvg = (
    this.behavioralRisk.phishingSusceptibility +
    this.behavioralRisk.socialEngineeringRisk +
    this.behavioralRisk.passwordHygiene +
    this.behavioralRisk.dataHandlingRisk
  ) / 4;
  
  const technicalAvg = (
    this.technicalRisk.deviceSecurity +
    this.technicalRisk.softwareCompliance +
    this.technicalRisk.networkSecurity +
    this.technicalRisk.accessControl
  ) / 4;
  
  const organizationalAvg = (
    this.organizationalRisk.policyCompliance +
    this.organizationalRisk.trainingCompletion +
    this.organizationalRisk.incidentResponse +
    this.organizationalRisk.securityAwareness
  ) / 4;
  
  const environmentalAvg = (
    this.environmentalRisk.remoteWorkRisk +
    this.environmentalRisk.physicalSecurity +
    this.environmentalRisk.thirdPartyRisk +
    this.environmentalRisk.complianceRisk
  ) / 4;
  
  this.overallHVI = Math.round(
    (behavioralAvg * weights.behavioral) +
    (technicalAvg * weights.technical) +
    (organizationalAvg * weights.organizational) +
    (environmentalAvg * weights.environmental)
  );
  
  // Determine risk level
  if (this.overallHVI >= 75) this.riskLevel = 'Critical';
  else if (this.overallHVI >= 50) this.riskLevel = 'High';
  else if (this.overallHVI >= 25) this.riskLevel = 'Medium';
  else this.riskLevel = 'Low';
  
  this.lastCalculated = new Date();
  
  return this.overallHVI;
};

// Export models
module.exports = {
  User: mongoose.model('User', UserSchema),
  Assessment: mongoose.model('Assessment', AssessmentSchema),
  Simulation: mongoose.model('Simulation', SimulationSchema),
  HVIScoring: mongoose.model('HVIScoring', HVIScoringSchema)
};
