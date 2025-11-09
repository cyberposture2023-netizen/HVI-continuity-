const { User, Assessment, Simulation } = require('./models');
const HVIScoringEngine = require('../services/HVIScoringEngine');

// Professional Reporting Controller
class ReportingController {
  
  // Generate comprehensive HVI report for user
  static async generateUserHVIReport(userId, options = {}) {
    try {
      const user = await User.findById(userId)
        .populate('hviProfile.hviHistory.assessmentId')
        .populate('hviProfile.behavioralMetrics.simulatedPhishingResults');
      
      if (!user) {
        throw new Error('User not found');
      }
      
      const comprehensiveScore = await HVIScoringEngine.calculateComprehensiveHVI(userId, options);
      
      const report = {
        metadata: {
          reportId: \HVI-\-\\,
          generatedAt: new Date(),
          reportType: 'Comprehensive HVI Assessment',
          version: '2.0'
        },
        executiveSummary: await this.generateExecutiveSummary(user, comprehensiveScore),
        userProfile: this.generateUserProfile(user),
        riskAssessment: await this.generateRiskAssessment(user, comprehensiveScore),
        detailedAnalysis: await this.generateDetailedAnalysis(user, comprehensiveScore),
        recommendations: this.generateComprehensiveRecommendations(comprehensiveScore),
        historicalTrends: await this.generateHistoricalTrends(user),
        peerComparison: await this.generatePeerComparisonReport(user),
        complianceStatus: await this.generateComplianceStatus(user),
        actionPlan: await this.generateActionPlan(user, comprehensiveScore)
      };
      
      return report;
    } catch (error) {
      console.error('Error generating user HVI report:', error);
      throw error;
    }
  }
  
  // Generate executive summary
  static async generateExecutiveSummary(user, comprehensiveScore) {
    const trend = comprehensiveScore.trendAnalysis;
    const comparison = comprehensiveScore.peerComparison;
    
    return {
      overallHVI: comprehensiveScore.overallHVI,
      riskLevel: comprehensiveScore.riskLevel,
      confidenceScore: comprehensiveScore.confidenceScore,
      keyFindings: [
        \Overall HVI Score: \/100 (\ Risk)\,
        \Trend: \ (\ \ points)\,
        \Peer Comparison: \\,
        \Critical Risks Identified: \\
      ],
      summary: \\ \ demonstrates \ human risk profile with \% confidence in this assessment.\
    };
  }
  
  // Generate user profile section
  static generateUserProfile(user) {
    return {
      personal: {
        name: \\ \\,
        email: user.email,
        department: user.hviProfile.department,
        jobRole: user.hviProfile.jobRole
      },
      organizational: {
        accessLevel: user.hviProfile.accessLevel,
        sensitivityLevel: user.hviProfile.sensitivityLevel,
        riskCategory: this.determineRiskCategory(user.hviProfile.accessLevel, user.hviProfile.sensitivityLevel)
      },
      tenure: {
        accountCreated: user.createdAt,
        lastLogin: user.lastLogin,
        isActive: user.isActive
      }
    };
  }
  
  // Generate risk assessment section
  static async generateRiskAssessment(user, comprehensiveScore) {
    const criticalRisks = comprehensiveScore.riskBreakdown?.criticalRisks || [];
    
    return {
      overallRisk: {
        score: comprehensiveScore.overallHVI,
        level: comprehensiveScore.riskLevel,
        description: this.getRiskDescription(comprehensiveScore.overallHVI)
      },
      dimensionRisks: {
        behavioral: {
          score: comprehensiveScore.behavioral.overall,
          level: this.determineRiskLevel(comprehensiveScore.behavioral.overall),
          keyRisks: comprehensiveScore.behavioral.riskFactors
        },
        technical: {
          score: comprehensiveScore.technical.overall,
          level: this.determineRiskLevel(comprehensiveScore.technical.overall),
          keyRisks: comprehensiveScore.technical.riskFactors
        },
        organizational: {
          score: comprehensiveScore.organizational.overall,
          level: this.determineRiskLevel(comprehensiveScore.organizational.overall),
          keyRisks: comprehensiveScore.organizational.riskFactors
        },
        environmental: {
          score: comprehensiveScore.environmental.overall,
          level: this.determineRiskLevel(comprehensiveScore.environmental.overall),
          keyRisks: comprehensiveScore.environmental.riskFactors
        }
      },
      criticalRisks: criticalRisks.map(risk => ({
        dimension: risk.dimension,
        risk: risk.risk,
        score: risk.score,
        impact: risk.impact,
        urgency: this.determineUrgency(risk.score)
      })),
      riskHeatmap: await this.generateRiskHeatmap(user, comprehensiveScore)
    };
  }
  
  // Generate detailed analysis section
  static async generateDetailedAnalysis(user, comprehensiveScore) {
    return {
      behavioralAnalysis: {
        phishingSusceptibility: {
          score: comprehensiveScore.behavioral.components.phishingSusceptibility,
          interpretation: this.interpretPhishingScore(comprehensiveScore.behavioral.components.phishingSusceptibility),
          dataPoints: user.hviProfile.behavioralMetrics?.simulatedPhishingResults?.length || 0
        },
        socialEngineering: {
          score: comprehensiveScore.behavioral.components.socialEngineeringRisk,
          interpretation: this.interpretSocialEngineeringScore(comprehensiveScore.behavioral.components.socialEngineeringRisk)
        },
        passwordHygiene: {
          score: comprehensiveScore.behavioral.components.passwordHygiene,
          interpretation: this.interpretPasswordScore(comprehensiveScore.behavioral.components.passwordHygiene)
        }
      },
      technicalAnalysis: {
        deviceSecurity: {
          score: comprehensiveScore.technical.components.deviceSecurity,
          interpretation: this.interpretTechnicalScore(comprehensiveScore.technical.components.deviceSecurity)
        },
        softwareCompliance: {
          score: comprehensiveScore.technical.components.softwareCompliance,
          interpretation: this.interpretTechnicalScore(comprehensiveScore.technical.components.softwareCompliance)
        }
      },
      gapAnalysis: await this.performGapAnalysis(user, comprehensiveScore),
      strengthAnalysis: await this.identifyStrengths(user, comprehensiveScore)
    };
  }
  
  // Generate comprehensive recommendations
  static generateComprehensiveRecommendations(comprehensiveScore) {
    const allRecommendations = [
      ...comprehensiveScore.behavioral.recommendations,
      ...comprehensiveScore.technical.recommendations,
      ...comprehensiveScore.organizational.recommendations,
      ...comprehensiveScore.environmental.recommendations
    ];
    
    // Categorize by priority
    const highPriority = allRecommendations.filter(rec => rec.priority === 'High');
    const mediumPriority = allRecommendations.filter(rec => rec.priority === 'Medium');
    const lowPriority = allRecommendations.filter(rec => rec.priority === 'Low');
    
    return {
      highPriority: highPriority.map(rec => ({
        ...rec,
        expectedTimeline: '1-2 weeks',
        successMetrics: \Improve \ score by \ points\
      })),
      mediumPriority: mediumPriority.map(rec => ({
        ...rec,
        expectedTimeline: '3-4 weeks',
        successMetrics: \Improve \ score by \ points\
      })),
      lowPriority: lowPriority.map(rec => ({
        ...rec,
        expectedTimeline: '1-2 months',
        successMetrics: \Improve \ score by \ points\
      }))
    };
  }
  
  // Generate historical trends
  static async generateHistoricalTrends(user) {
    const history = user.hviProfile.hviHistory || [];
    
    if (history.length < 2) {
      return { message: 'Insufficient historical data for trend analysis' };
    }
    
    const recentScores = history.slice(-6).map((entry, index) => ({
      period: \Assessment \\,
      date: entry.calculatedAt,
      score: entry.score.overallHVI,
      riskLevel: entry.score.riskLevel
    }));
    
    const scoreChanges = [];
    for (let i = 1; i < recentScores.length; i++) {
      const change = recentScores[i].score - recentScores[i-1].score;
      scoreChanges.push({
        period: \\ to \\,
        change: change,
        direction: change > 0 ? 'improvement' : change < 0 ? 'deterioration' : 'stable'
      });
    }
    
    return {
      timeline: recentScores,
      overallTrend: this.calculateOverallTrend(recentScores),
      significantChanges: scoreChanges.filter(change => Math.abs(change.change) >= 10),
      consistency: this.assessConsistency(recentScores)
    };
  }
  
  // Generate peer comparison report
  static async generatePeerComparisonReport(user) {
    const comparison = await HVIScoringEngine.calculatePeerComparison(user);
    
    if (!comparison.average) {
      return { message: 'No peer data available for comparison' };
    }
    
    return {
      department: user.hviProfile.department,
      peerGroupSize: comparison.totalPeers,
      userScore: user.hviProfile.currentHVI?.overallHVI || 0,
      departmentAverage: comparison.average,
      percentile: comparison.percentile,
      performance: comparison.comparison,
      interpretation: this.interpretPeerComparison(comparison.percentile)
    };
  }
  
  // Generate compliance status
  static async generateComplianceStatus(user) {
    const metrics = user.hviProfile.behavioralMetrics || {};
    
    return {
      training: {
        completed: metrics.trainingScores?.length || 0,
        averageScore: metrics.trainingScores?.length > 0 ? 
          Math.round(metrics.trainingScores.reduce((sum, t) => sum + t.score, 0) / metrics.trainingScores.length) : 0,
        status: this.assessTrainingStatus(metrics.trainingScores)
      },
      policy: {
        acknowledged: metrics.policyAcknowledgements?.filter(p => p.acknowledged).length || 0,
        total: metrics.policyAcknowledgements?.length || 0,
        complianceRate: metrics.policyAcknowledgements?.length > 0 ?
          Math.round((metrics.policyAcknowledgements.filter(p => p.acknowledged).length / metrics.policyAcknowledgements.length) * 100) : 0
      },
      simulations: {
        phishingTests: metrics.simulatedPhishingResults?.length || 0,
        recentPerformance: this.assessRecentPhishingPerformance(metrics.simulatedPhishingResults)
      }
    };
  }
  
  // Generate action plan
  static async generateActionPlan(user, comprehensiveScore) {
    const recommendations = this.generateComprehensiveRecommendations(comprehensiveScore);
    
    return {
      immediateActions: recommendations.highPriority.map(rec => ({
        action: rec.action,
        responsible: 'User & Manager',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
        successCriteria: rec.successMetrics,
        resources: this.suggestResources(rec.category)
      })),
      shortTermGoals: recommendations.mediumPriority.map(rec => ({
        action: rec.action,
        timeline: '1 month',
        metrics: rec.successMetrics
      })),
      longTermStrategy: recommendations.lowPriority.map(rec => ({
        action: rec.action,
        timeline: '3 months',
        objectives: \Sustain improved \ practices\
      })),
      monitoring: {
        nextAssessment: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        keyMetrics: ['HVI Score', 'Phishing Susceptibility', 'Training Completion'],
        reviewSchedule: 'Monthly with manager'
      }
    };
  }
  
  // Helper methods
  static getRiskDescription(score) {
    if (score >= 75) return 'a CRITICAL';
    if (score >= 50) return 'a HIGH';
    if (score >= 25) return 'a MODERATE';
    return 'a LOW';
  }
  
  static determineRiskCategory(accessLevel, sensitivityLevel) {
    if (accessLevel === 'Critical' || sensitivityLevel === 'Restricted') return 'High-Impact';
    if (accessLevel === 'High' || sensitivityLevel === 'Confidential') return 'Medium-Impact';
    return 'Standard';
  }
  
  static determineRiskLevel(score) {
    if (score >= 75) return 'Critical';
    if (score >= 50) return 'High';
    if (score >= 25) return 'Medium';
    return 'Low';
  }
  
  static determineUrgency(score) {
    if (score >= 80) return 'Immediate';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  }
  
  static interpretPhishingScore(score) {
    if (score >= 80) return 'Very susceptible to phishing attacks';
    if (score >= 60) return 'Moderately susceptible to phishing';
    if (score >= 40) return 'Somewhat resistant to phishing';
    return 'Highly resistant to phishing attacks';
  }
  
  static interpretSocialEngineeringScore(score) {
    if (score >= 70) return 'High vulnerability to social engineering';
    if (score >= 50) return 'Moderate vulnerability';
    return 'Good awareness and resistance';
  }
  
  static interpretPasswordScore(score) {
    if (score >= 80) return 'Excellent password hygiene';
    if (score >= 60) return 'Good password practices';
    if (score >= 40) return 'Needs improvement';
    return 'Poor password security';
  }
  
  static interpretTechnicalScore(score) {
    if (score >= 80) return 'Strong technical security posture';
    if (score >= 60) return 'Adequate technical controls';
    if (score >= 40) return 'Technical security needs attention';
    return 'Critical technical security gaps';
  }
  
  static calculateOverallTrend(scores) {
    if (scores.length < 2) return 'Insufficient data';
    
    const firstScore = scores[0].score;
    const lastScore = scores[scores.length - 1].score;
    const change = lastScore - firstScore;
    
    if (change > 10) return 'Significant Improvement';
    if (change > 5) return 'Moderate Improvement';
    if (change < -10) return 'Significant Deterioration';
    if (change < -5) return 'Moderate Deterioration';
    return 'Stable';
  }
  
  static assessConsistency(scores) {
    const scoreValues = scores.map(s => s.score);
    const average = scoreValues.reduce((sum, s) => sum + s, 0) / scoreValues.length;
    const variance = scoreValues.reduce((sum, s) => sum + Math.pow(s - average, 2), 0) / scoreValues.length;
    
    return variance < 100 ? 'Consistent' : variance < 400 ? 'Moderately Variable' : 'Highly Variable';
  }
  
  static interpretPeerComparison(percentile) {
    if (percentile >= 80) return 'Top performer in department';
    if (percentile >= 60) return 'Above average performance';
    if (percentile >= 40) return 'Average performance';
    if (percentile >= 20) return 'Below average performance';
    return 'Needs significant improvement';
  }
  
  static assessTrainingStatus(trainingScores) {
    if (!trainingScores || trainingScores.length === 0) return 'No training data';
    
    const recentTraining = trainingScores.filter(t => 
      new Date(t.completionDate) > new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
    );
    
    if (recentTraining.length === 0) return 'Overdue for training';
    if (recentTraining.length >= 3) return 'Compliant';
    return 'Partially compliant';
  }
  
  static assessRecentPhishingPerformance(phishingResults) {
    if (!phishingResults || phishingResults.length === 0) return 'No data';
    
    const recentResults = phishingResults.filter(r => 
      new Date(r.date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    );
    
    if (recentResults.length === 0) return 'No recent tests';
    
    const clickRate = recentResults.filter(r => r.clicked).length / recentResults.length;
    
    if (clickRate < 0.1) return 'Excellent';
    if (clickRate < 0.3) return 'Good';
    if (clickRate < 0.5) return 'Needs Improvement';
    return 'Critical';
  }
  
  static suggestResources(category) {
    const resources = {
      'Behavioral': ['Phishing awareness training', 'Social engineering workshops', 'Security awareness courses'],
      'Technical': ['Device security guides', 'Software compliance training', 'Network security best practices'],
      'Organizational': ['Policy review sessions', 'Compliance training', 'Security procedure documentation'],
      'Environmental': ['Remote work security guidelines', 'Physical security protocols', 'Third-party risk management']
    };
    
    return resources[category] || ['General security awareness training'];
  }
  
  static async generateRiskHeatmap(user, comprehensiveScore) {
    // Generate risk heatmap data for visualization
    return {
      behavioral: {
        phishing: comprehensiveScore.behavioral.components.phishingSusceptibility,
        socialEngineering: comprehensiveScore.behavioral.components.socialEngineeringRisk,
        password: comprehensiveScore.behavioral.components.passwordHygiene,
        dataHandling: comprehensiveScore.behavioral.components.dataHandlingRisk
      },
      technical: {
        device: comprehensiveScore.technical.components.deviceSecurity,
        software: comprehensiveScore.technical.components.softwareCompliance,
        network: comprehensiveScore.technical.components.networkSecurity,
        access: comprehensiveScore.technical.components.accessControl
      }
    };
  }
  
  static async performGapAnalysis(user, comprehensiveScore) {
    // Identify gaps between current and target scores
    const targetScore = 70; // Target for good security posture
    
    const gaps = [];
    
    if (comprehensiveScore.behavioral.overall < targetScore) {
      gaps.push({
        dimension: 'Behavioral',
        current: comprehensiveScore.behavioral.overall,
        target: targetScore,
        gap: targetScore - comprehensiveScore.behavioral.overall
      });
    }
    
    if (comprehensiveScore.technical.overall < targetScore) {
      gaps.push({
        dimension: 'Technical',
        current: comprehensiveScore.technical.overall,
        target: targetScore,
        gap: targetScore - comprehensiveScore.technical.overall
      });
    }
    
    return gaps.sort((a, b) => b.gap - a.gap); // Sort by largest gap first
  }
  
  static async identifyStrengths(user, comprehensiveScore) {
    // Identify areas of strength (scores above 80)
    const strengths = [];
    
    if (comprehensiveScore.behavioral.overall >= 80) {
      strengths.push('Strong behavioral security awareness');
    }
    
    if (comprehensiveScore.technical.overall >= 80) {
      strengths.push('Excellent technical security practices');
    }
    
    if (comprehensiveScore.organizational.overall >= 80) {
      strengths.push('High organizational compliance');
    }
    
    return strengths.length > 0 ? strengths : ['Demonstrates baseline security awareness'];
  }
}

module.exports = ReportingController;
