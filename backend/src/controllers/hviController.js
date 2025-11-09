const { User, Assessment, Simulation, HVIScoring } = require('./models');
const HVIScoringEngine = require('../services/HVIScoringEngine');
const mongoose = require('mongoose');

// Enhanced HVI Controller with Advanced Scoring
class HVIController {
  
  // Calculate comprehensive HVI score using advanced engine
  static async calculateComprehensiveHVI(userId, options = {}) {
    try {
      const comprehensiveScore = await HVIScoringEngine.calculateComprehensiveHVI(userId, options);
      
      // Update user's current HVI
      const user = await User.findById(userId);
      user.hviProfile.currentHVI = comprehensiveScore;
      
      // Add to history
      user.hviProfile.hviHistory.push({
        score: comprehensiveScore,
        calculatedAt: new Date(),
        assessmentId: options.assessmentId || null
      });
      
      await user.save();
      
      return comprehensiveScore;
    } catch (error) {
      console.error('Error in comprehensive HVI calculation:', error);
      throw error;
    }
  }
  
  // Batch calculate HVI for multiple users
  static async calculateBatchHVI(userIds, options = {}) {
    try {
      const results = [];
      
      for (const userId of userIds) {
        try {
          const score = await this.calculateComprehensiveHVI(userId, options);
          results.push({
            userId,
            success: true,
            score: score.overallHVI,
            riskLevel: score.riskLevel
          });
        } catch (error) {
          results.push({
            userId,
            success: false,
            error: error.message
          });
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error in batch HVI calculation:', error);
      throw error;
    }
  }
  
  // Generate detailed HVI report
  static async generateDetailedHVIReport(userId) {
    try {
      const comprehensiveScore = await HVIScoringEngine.calculateComprehensiveHVI(userId);
      const user = await User.findById(userId);
      
      const report = {
        user: {
          id: user._id,
          name: \\ \\,
          department: user.hviProfile.department,
          jobRole: user.hviProfile.jobRole,
          accessLevel: user.hviProfile.accessLevel,
          sensitivityLevel: user.hviProfile.sensitivityLevel
        },
        score: comprehensiveScore,
        summary: {
          overallRisk: comprehensiveScore.riskLevel,
          confidence: comprehensiveScore.confidenceScore,
          trend: comprehensiveScore.trendAnalysis.trend,
          peerComparison: comprehensiveScore.peerComparison.comparison
        },
        riskBreakdown: {
          criticalRisks: this.identifyCriticalRisks(comprehensiveScore),
          improvementAreas: this.identifyImprovementAreas(comprehensiveScore)
        },
        recommendations: this.compileAllRecommendations(comprehensiveScore),
        historicalContext: await this.getHistoricalContext(user)
      };
      
      return report;
    } catch (error) {
      console.error('Error generating detailed HVI report:', error);
      throw error;
    }
  }
  
  // Identify critical risks from comprehensive score
  static identifyCriticalRisks(score) {
    const criticalRisks = [];
    const threshold = 70; // Score above 70 indicates critical risk
    
    // Check behavioral risks
    if (score.behavioral.components.phishingSusceptibility > threshold) {
      criticalRisks.push({
        dimension: 'Behavioral',
        risk: 'High Phishing Susceptibility',
        score: score.behavioral.components.phishingSusceptibility,
        impact: 'High risk of credential compromise'
      });
    }
    
    if (score.behavioral.components.socialEngineeringRisk > threshold) {
      criticalRisks.push({
        dimension: 'Behavioral',
        risk: 'Social Engineering Vulnerability',
        score: score.behavioral.components.socialEngineeringRisk,
        impact: 'Susceptible to manipulation and social attacks'
      });
    }
    
    // Check technical risks
    if (score.technical.components.deviceSecurity < 30) {
      criticalRisks.push({
        dimension: 'Technical',
        risk: 'Poor Device Security',
        score: score.technical.components.deviceSecurity,
        impact: 'High risk of device compromise'
      });
    }
    
    return criticalRisks;
  }
  
  // Identify areas for improvement
  static identifyImprovementAreas(score) {
    const improvements = [];
    const improvementThreshold = 40; // Scores below 40 need improvement
    
    Object.entries(score.behavioral.components).forEach(([component, value]) => {
      if (value < improvementThreshold) {
        improvements.push({
          dimension: 'Behavioral',
          area: component,
          currentScore: value,
          target: 70
        });
      }
    });
    
    Object.entries(score.technical.components).forEach(([component, value]) => {
      if (value < improvementThreshold) {
        improvements.push({
          dimension: 'Technical',
          area: component,
          currentScore: value,
          target: 70
        });
      }
    });
    
    return improvements;
  }
  
  // Compile all recommendations from all dimensions
  static compileAllRecommendations(score) {
    const allRecommendations = [
      ...score.behavioral.recommendations,
      ...score.technical.recommendations,
      ...score.organizational.recommendations,
      ...score.environmental.recommendations
    ];
    
    // Sort by priority (High > Medium > Low)
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return allRecommendations.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  }
  
  // Get historical context for the user
  static async getHistoricalContext(user) {
    const history = user.hviProfile.hviHistory || [];
    
    if (history.length === 0) {
      return { message: 'No historical data available' };
    }
    
    const recentScores = history.slice(-6).map(h => ({
      date: h.calculatedAt,
      score: h.score.overallHVI,
      riskLevel: h.score.riskLevel
    }));
    
    return {
      totalAssessments: history.length,
      recentTrend: recentScores,
      averageScore: Math.round(recentScores.reduce((sum, s) => sum + s.score, 0) / recentScores.length),
      bestScore: Math.min(...recentScores.map(s => s.score)),
      worstScore: Math.max(...recentScores.map(s => s.score))
    };
  }
}

module.exports = HVIController;
