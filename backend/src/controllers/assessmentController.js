const { Assessment, User, HVIScoring } = require('./models');
const HVIScoringEngine = require('../services/HVIScoringEngine');

// Enhanced Assessment Controller
class AssessmentController {
  
  // Create new assessment
  static async createAssessment(assessmentData, createdBy) {
    try {
      const assessment = new Assessment({
        ...assessmentData,
        createdBy: createdBy
      });
      
      await assessment.save();
      return assessment;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  }
  
  // Get assessment by ID with populated data
  static async getAssessmentById(assessmentId) {
    try {
      const assessment = await Assessment.findById(assessmentId)
        .populate('createdBy', 'username profile.firstName profile.lastName')
        .populate('participants.userId', 'username profile.firstName profile.lastName hviProfile.department');
      
      if (!assessment) {
        throw new Error('Assessment not found');
      }
      
      return assessment;
    } catch (error) {
      console.error('Error getting assessment:', error);
      throw error;
    }
  }
  
  // Get all assessments with filtering and pagination
  static async getAssessments(filters = {}, page = 1, limit = 10) {
    try {
      const query = {};
      
      // Apply filters
      if (filters.type) query.type = filters.type;
      if (filters.status) query.isActive = filters.status === 'active';
      if (filters.department) {
        query['targetGroup.department'] = filters.department;
      }
      
      const skip = (page - 1) * limit;
      
      const assessments = await Assessment.find(query)
        .populate('createdBy', 'username profile.firstName profile.lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Assessment.countDocuments(query);
      
      return {
        assessments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error getting assessments:', error);
      throw error;
    }
  }
  
  // Assign assessment to users
  static async assignAssessment(assessmentId, userIds) {
    try {
      const assessment = await Assessment.findById(assessmentId);
      if (!assessment) {
        throw new Error('Assessment not found');
      }
      
      // Add users to participants if not already added
      for (const userId of userIds) {
        const existingParticipant = assessment.participants.find(
          p => p.userId.toString() === userId
        );
        
        if (!existingParticipant) {
          assessment.participants.push({
            userId: userId,
            startedAt: null,
            completedAt: null,
            responses: [],
            sectionScores: {},
            finalScore: null,
            recommendations: []
          });
        }
      }
      
      await assessment.save();
      return assessment;
    } catch (error) {
      console.error('Error assigning assessment:', error);
      throw error;
    }
  }
  
  // Start assessment for user
  static async startAssessment(assessmentId, userId) {
    try {
      const assessment = await Assessment.findById(assessmentId);
      if (!assessment) {
        throw new Error('Assessment not found');
      }
      
      const participant = assessment.participants.find(
        p => p.userId.toString() === userId
      );
      
      if (!participant) {
        throw new Error('User not assigned to this assessment');
      }
      
      if (participant.startedAt) {
        throw new Error('Assessment already started');
      }
      
      participant.startedAt = new Date();
      await assessment.save();
      
      return {
        assessment: assessment.title,
        startedAt: participant.startedAt,
        sections: assessment.sections
      };
    } catch (error) {
      console.error('Error starting assessment:', error);
      throw error;
    }
  }
  
  // Submit assessment response
  static async submitResponse(assessmentId, userId, responses) {
    try {
      const assessment = await Assessment.findById(assessmentId);
      if (!assessment) {
        throw new Error('Assessment not found');
      }
      
      const participant = assessment.participants.find(
        p => p.userId.toString() === userId
      );
      
      if (!participant) {
        throw new Error('User not assigned to this assessment');
      }
      
      if (!participant.startedAt) {
        throw new Error('Assessment not started');
      }
      
      if (participant.completedAt) {
        throw new Error('Assessment already completed');
      }
      
      // Process and validate responses
      const processedResponses = this.processResponses(assessment, responses);
      participant.responses = processedResponses;
      
      // Calculate scores
      const scoringResult = this.calculateAssessmentScores(assessment, processedResponses);
      participant.sectionScores = scoringResult.sectionScores;
      participant.finalScore = scoringResult.finalScore;
      participant.recommendations = scoringResult.recommendations;
      
      participant.completedAt = new Date();
      
      // Update user's HVI score
      await this.updateUserHVIFromAssessment(userId, assessment, scoringResult);
      
      await assessment.save();
      
      return {
        success: true,
        score: scoringResult.finalScore,
        sectionScores: scoringResult.sectionScores,
        recommendations: scoringResult.recommendations,
        completedAt: participant.completedAt
      };
    } catch (error) {
      console.error('Error submitting assessment response:', error);
      throw error;
    }
  }
  
  // Process and validate responses
  static processResponses(assessment, responses) {
    const processedResponses = [];
    
    for (const response of responses) {
      const question = assessment.sections
        .flatMap(s => s.questions)
        .find(q => q.questionId === response.questionId);
      
      if (!question) {
        throw new Error(\Question \ not found in assessment\);
      }
      
      // Validate response based on question type
      const validatedResponse = this.validateResponse(question, response.answer);
      
      processedResponses.push({
        questionId: response.questionId,
        answer: validatedResponse,
        score: this.calculateQuestionScore(question, validatedResponse),
        riskFactors: this.identifyRiskFactors(question, validatedResponse),
        submittedAt: new Date()
      });
    }
    
    return processedResponses;
  }
  
  // Validate response based on question type
  static validateResponse(question, answer) {
    switch (question.type) {
      case 'multiple_choice':
        if (!question.options.some(opt => opt.value === answer)) {
          throw new Error(\Invalid option for question \\);
        }
        return answer;
        
      case 'likert':
        const numericAnswer = parseInt(answer);
        if (isNaN(numericAnswer) || numericAnswer < 1 || numericAnswer > 5) {
          throw new Error(\Likert scale answer must be between 1 and 5 for question \\);
        }
        return numericAnswer;
        
      case 'behavioral':
      case 'technical':
        // For behavioral and technical questions, accept various answer types
        return answer;
        
      default:
        return answer;
    }
  }
  
  // Calculate score for individual question
  static calculateQuestionScore(question, answer) {
    switch (question.type) {
      case 'multiple_choice':
        const option = question.options.find(opt => opt.value === answer);
        return option ? option.score : 0;
        
      case 'likert':
        // Convert likert scale (1-5) to score (0-100)
        return (answer - 1) * 25;
        
      case 'behavioral':
      case 'technical':
        // For complex questions, use predefined scoring logic
        return this.scoreComplexQuestion(question, answer);
        
      default:
        return 0;
    }
  }
  
  // Score complex behavioral/technical questions
  static scoreComplexQuestion(question, answer) {
    // This would contain complex scoring logic based on question type and answer
    // For now, return a base score
    let baseScore = 50;
    
    if (typeof answer === 'boolean') {
      return answer ? 100 : 0;
    }
    
    if (typeof answer === 'number') {
      return Math.min(100, Math.max(0, answer));
    }
    
    return baseScore;
  }
  
  // Identify risk factors from response
  static identifyRiskFactors(question, answer) {
    const riskFactors = [];
    
    if (question.type === 'multiple_choice') {
      const option = question.options.find(opt => opt.value === answer);
      if (option && option.riskFactor) {
        riskFactors.push(option.riskFactor);
      }
    }
    
    // Add question-specific risk factors
    if (question.riskCategory && this.isRiskyAnswer(question, answer)) {
      riskFactors.push(question.riskCategory);
    }
    
    return riskFactors;
  }
  
  // Determine if answer indicates risk
  static isRiskyAnswer(question, answer) {
    // Implement risk detection logic based on question type and answer
    switch (question.type) {
      case 'multiple_choice':
        const option = question.options.find(opt => opt.value === answer);
        return option && option.score < 50;
        
      case 'likert':
        return answer <= 2; // Low scores indicate risk
        
      default:
        return false;
    }
  }
  
  // Calculate overall assessment scores
  static calculateAssessmentScores(assessment, responses) {
    const sectionScores = {};
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    // Calculate scores for each section
    for (const section of assessment.sections) {
      const sectionResponses = responses.filter(r => 
        section.questions.some(q => q.questionId === r.questionId)
      );
      
      if (sectionResponses.length > 0) {
        const sectionScore = sectionResponses.reduce((sum, r) => sum + r.score, 0) / sectionResponses.length;
        sectionScores[section.sectionId] = Math.round(sectionScore);
        
        totalWeightedScore += sectionScore * (section.weight || 1);
        totalWeight += (section.weight || 1);
      }
    }
    
    // Calculate final score
    const finalScoreValue = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    
    const finalScore = new HVIScoring({
      overallHVI: Math.round(finalScoreValue),
      riskLevel: this.determineRiskLevel(finalScoreValue),
      lastCalculated: new Date()
    });
    
    // Generate recommendations
    const recommendations = this.generateAssessmentRecommendations(assessment, responses, sectionScores);
    
    return {
      sectionScores,
      finalScore,
      recommendations
    };
  }
  
  // Determine risk level from score
  static determineRiskLevel(score) {
    if (score >= 75) return 'Critical';
    if (score >= 50) return 'High';
    if (score >= 25) return 'Medium';
    return 'Low';
  }
  
  // Generate recommendations based on assessment results
  static generateAssessmentRecommendations(assessment, responses, sectionScores) {
    const recommendations = [];
    
    // Identify low-scoring sections
    Object.entries(sectionScores).forEach(([sectionId, score]) => {
      if (score < 50) {
        const section = assessment.sections.find(s => s.sectionId === sectionId);
        recommendations.push({
          area: section.title,
          score: score,
          recommendation: \Focus on improving \ awareness and practices\,
          priority: score < 25 ? 'High' : 'Medium'
        });
      }
    });
    
    // Identify specific risk factors
    const allRiskFactors = responses.flatMap(r => r.riskFactors);
    const riskFactorCounts = allRiskFactors.reduce((acc, factor) => {
      acc[factor] = (acc[factor] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(riskFactorCounts).forEach(([factor, count]) => {
      if (count >= 2) { // Multiple instances of same risk factor
        recommendations.push({
          area: factor,
          instances: count,
          recommendation: \Address recurring \ issues\,
          priority: 'High'
        });
      }
    });
    
    return recommendations;
  }
  
  // Update user's HVI based on assessment results
  static async updateUserHVIFromAssessment(userId, assessment, scoringResult) {
    try {
      // Use the comprehensive HVI scoring engine
      await require('./hviController').calculateComprehensiveHVI(userId, {
        assessmentId: assessment._id,
        assessmentData: scoringResult
      });
    } catch (error) {
      console.error('Error updating user HVI from assessment:', error);
      // Don't throw error to avoid failing the assessment submission
    }
  }
  
  // Get assessment analytics
  static async getAssessmentAnalytics(assessmentId) {
    try {
      const assessment = await this.getAssessmentById(assessmentId);
      
      const analytics = {
        assessment: {
          id: assessment._id,
          title: assessment.title,
          type: assessment.type,
          totalParticipants: assessment.participants.length
        },
        participation: {
          total: assessment.participants.length,
          completed: assessment.participants.filter(p => p.completedAt).length,
          inProgress: assessment.participants.filter(p => p.startedAt && !p.completedAt).length,
          notStarted: assessment.participants.filter(p => !p.startedAt).length
        },
        scores: {
          average: 0,
          distribution: {
            excellent: 0, // 90-100
            good: 0,      // 70-89
            fair: 0,      // 50-69
            poor: 0       // 0-49
          }
        },
        sectionPerformance: {},
        riskFactors: {}
      };
      
      // Calculate score statistics
      const completedParticipants = assessment.participants.filter(p => p.completedAt);
      if (completedParticipants.length > 0) {
        const scores = completedParticipants.map(p => p.finalScore?.overallHVI || 0);
        analytics.scores.average = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
        
        // Score distribution
        analytics.scores.distribution = {
          excellent: scores.filter(s => s >= 90).length,
          good: scores.filter(s => s >= 70 && s < 90).length,
          fair: scores.filter(s => s >= 50 && s < 70).length,
          poor: scores.filter(s => s < 50).length
        };
        
        // Section performance
        assessment.sections.forEach(section => {
          const sectionScores = completedParticipants
            .map(p => p.sectionScores?.[section.sectionId] || 0)
            .filter(score => score > 0);
          
          if (sectionScores.length > 0) {
            analytics.sectionPerformance[section.sectionId] = {
              title: section.title,
              average: Math.round(sectionScores.reduce((sum, s) => sum + s, 0) / sectionScores.length),
              participants: sectionScores.length
            };
          }
        });
        
        // Aggregate risk factors
        const allRiskFactors = completedParticipants.flatMap(p => 
          p.responses.flatMap(r => r.riskFactors)
        );
        analytics.riskFactors = allRiskFactors.reduce((acc, factor) => {
          acc[factor] = (acc[factor] || 0) + 1;
          return acc;
        }, {});
      }
      
      return analytics;
    } catch (error) {
      console.error('Error getting assessment analytics:', error);
      throw error;
    }
  }
  
  // Get assessment templates
  static getAssessmentTemplates() {
    return {
      behavioral: {
        title: 'Behavioral Risk Assessment',
        type: 'Behavioral',
        description: 'Comprehensive assessment of human behavior and security awareness',
        sections: [
          {
            sectionId: 'security_awareness',
            title: 'Security Awareness',
            description: 'General security knowledge and awareness',
            weight: 0.3,
            questions: [
              {
                questionId: 'sec_aware_1',
                text: 'How often do you review and update your passwords?',
                type: 'multiple_choice',
                options: [
                  { value: 'Every 30 days', score: 100, riskFactor: 'Good password hygiene' },
                  { value: 'Every 90 days', score: 70, riskFactor: 'Adequate password hygiene' },
                  { value: 'Only when required', score: 40, riskFactor: 'Poor password hygiene' },
                  { value: 'Never', score: 0, riskFactor: 'Critical password risk' }
                ],
                riskCategory: 'Password Security',
                maxScore: 100
              }
            ]
          }
        ]
      },
      technical: {
        title: 'Technical Security Assessment',
        type: 'Technical',
        description: 'Assessment of technical security practices and knowledge',
        sections: [
          {
            sectionId: 'device_security',
            title: 'Device Security',
            description: 'Security practices for company devices',
            weight: 0.4,
            questions: [
              {
                questionId: 'device_sec_1',
                text: 'Do you enable automatic screen locking on your devices?',
                type: 'multiple_choice',
                options: [
                  { value: 'Always', score: 100, riskFactor: 'Good device security' },
                  { value: 'Sometimes', score: 50, riskFactor: 'Inconsistent device security' },
                  { value: 'Never', score: 0, riskFactor: 'Poor device security' }
                ],
                riskCategory: 'Device Security',
                maxScore: 100
              }
            ]
          }
        ]
      }
    };
  }
}

module.exports = AssessmentController;
