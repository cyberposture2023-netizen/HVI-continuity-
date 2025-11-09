const { User, Assessment, Simulation } = require('./models');

// Advanced HVI Scoring Engine
class HVIScoringEngine {
  
  // Calculate comprehensive HVI score with advanced algorithms
  static async calculateComprehensiveHVI(userId, options = {}) {
    try {
      const user = await User.findById(userId)
        .populate('hviProfile.hviHistory.assessmentId')
        .populate('hviProfile.behavioralMetrics.simulatedPhishingResults');
      
      if (!user) {
        throw new Error('User not found');
      }
      
      const hviScore = user.hviProfile.currentHVI || {};
      
      // Calculate scores for all four dimensions
      const behavioralScore = await this.calculateBehavioralDimension(user, options);
      const technicalScore = await this.calculateTechnicalDimension(user, options);
      const organizationalScore = await this.calculateOrganizationalDimension(user, options);
      const environmentalScore = await this.calculateEnvironmentalDimension(user, options);
      
      // Apply dimension weights
      const weights = options.weights || {
        behavioral: 0.4,
        technical: 0.3,
        organizational: 0.2,
        environmental: 0.1
      };
      
      // Calculate overall HVI
      const overallHVI = Math.round(
        (behavioralScore.overall * weights.behavioral) +
        (technicalScore.overall * weights.technical) +
        (organizationalScore.overall * weights.organizational) +
        (environmentalScore.overall * weights.environmental)
      );
      
      // Compile comprehensive results
      const comprehensiveScore = {
        behavioral: behavioralScore,
        technical: technicalScore,
        organizational: organizationalScore,
        environmental: environmentalScore,
        overallHVI: overallHVI,
        riskLevel: this.determineRiskLevel(overallHVI),
        calculatedAt: new Date(),
        confidenceScore: this.calculateConfidenceScore(user),
        trendAnalysis: await this.analyzeTrend(user),
        peerComparison: await this.calculatePeerComparison(user)
      };
      
      return comprehensiveScore;
    } catch (error) {
      console.error('Error in comprehensive HVI calculation:', error);
      throw error;
    }
  }
  
  // Calculate Behavioral Dimension Score
  static async calculateBehavioralDimension(user, options) {
    const metrics = user.hviProfile.behavioralMetrics || {};
    let score = {
      overall: 0,
      components: {},
      riskFactors: [],
      recommendations: []
    };
    
    // Phishing Susceptibility (0-100, higher = more susceptible)
    const phishingScore = await this.calculatePhishingSusceptibility(metrics);
    score.components.phishingSusceptibility = phishingScore.score;
    score.riskFactors.push(...phishingScore.riskFactors);
    
    // Social Engineering Risk
    const socialEngineeringScore = await this.calculateSocialEngineeringRisk(metrics);
    score.components.socialEngineeringRisk = socialEngineeringScore.score;
    score.riskFactors.push(...socialEngineeringScore.riskFactors);
    
    // Password Hygiene
    const passwordScore = this.calculatePasswordHygiene(metrics);
    score.components.passwordHygiene = passwordScore.score;
    
    // Data Handling Risk
    const dataHandlingScore = await this.calculateDataHandlingRisk(metrics);
    score.components.dataHandlingRisk = dataHandlingScore.score;
    score.riskFactors.push(...dataHandlingScore.riskFactors);
    
    // Calculate overall behavioral score (average of components)
    const componentScores = Object.values(score.components);
    score.overall = Math.round(componentScores.reduce((sum, s) => sum + s, 0) / componentScores.length);
    
    // Generate behavioral recommendations
    score.recommendations = this.generateBehavioralRecommendations(score);
    
    return score;
  }
  
  // Calculate Technical Dimension Score
  static async calculateTechnicalDimension(user, options) {
    let score = {
      overall: 0,
      components: {},
      riskFactors: [],
      recommendations: []
    };
    
    // Device Security (simulated - would integrate with actual device management)
    score.components.deviceSecurity = this.simulateDeviceSecurityScore(user);
    
    // Software Compliance
    score.components.softwareCompliance = this.simulateSoftwareCompliance(user);
    
    // Network Security
    score.components.networkSecurity = this.simulateNetworkSecurity(user);
    
    // Access Control
    score.components.accessControl = this.simulateAccessControl(user);
    
    // Calculate overall technical score
    const componentScores = Object.values(score.components);
    score.overall = Math.round(componentScores.reduce((sum, s) => sum + s, 0) / componentScores.length);
    
    // Generate technical recommendations
    score.recommendations = this.generateTechnicalRecommendations(score);
    
    return score;
  }
  
  // Calculate Organizational Dimension Score
  static async calculateOrganizationalDimension(user, options) {
    const metrics = user.hviProfile.behavioralMetrics || {};
    let score = {
      overall: 0,
      components: {},
      riskFactors: [],
      recommendations: []
    };
    
    // Policy Compliance
    score.components.policyCompliance = this.calculatePolicyCompliance(metrics);
    
    // Training Completion
    score.components.trainingCompletion = this.calculateTrainingCompletion(metrics);
    
    // Incident Response
    score.components.incidentResponse = this.calculateIncidentResponse(metrics);
    
    // Security Awareness
    score.components.securityAwareness = this.calculateSecurityAwareness(metrics);
    
    // Calculate overall organizational score
    const componentScores = Object.values(score.components);
    score.overall = Math.round(componentScores.reduce((sum, s) => sum + s, 0) / componentScores.length);
    
    // Generate organizational recommendations
    score.recommendations = this.generateOrganizationalRecommendations(score);
    
    return score;
  }
  
  // Calculate Environmental Dimension Score
  static async calculateEnvironmentalDimension(user, options) {
    let score = {
      overall: 0,
      components: {},
      riskFactors: [],
      recommendations: []
    };
    
    // Remote Work Risk
    score.components.remoteWorkRisk = this.calculateRemoteWorkRisk(user);
    
    // Physical Security
    score.components.physicalSecurity = this.calculatePhysicalSecurity(user);
    
    // Third Party Risk
    score.components.thirdPartyRisk = this.calculateThirdPartyRisk(user);
    
    // Compliance Risk
    score.components.complianceRisk = this.calculateComplianceRisk(user);
    
    // Calculate overall environmental score
    const componentScores = Object.values(score.components);
    score.overall = Math.round(componentScores.reduce((sum, s) => sum + s, 0) / componentScores.length);
    
    // Generate environmental recommendations
    score.recommendations = this.generateEnvironmentalRecommendations(score);
    
    return score;
  }
  
  // Phishing Susceptibility Calculation
  static async calculatePhishingSusceptibility(metrics) {
    const phishingResults = metrics.simulatedPhishingResults || [];
    const recentResults = phishingResults.filter(r => 
      new Date(r.date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
    );
    
    if (recentResults.length === 0) {
      return { score: 50, riskFactors: ['No recent phishing test data'] };
    }
    
    const clickRate = recentResults.filter(r => r.clicked).length / recentResults.length;
    const reportRate = recentResults.filter(r => r.reported).length / recentResults.length;
    
    // Score: 0-100 where higher = more susceptible
    let score = Math.round(clickRate * 100);
    
    const riskFactors = [];
    if (clickRate > 0.3) riskFactors.push('High phishing click rate');
    if (reportRate < 0.5) riskFactors.push('Low phishing reporting rate');
    
    return { score, riskFactors };
  }
  
  // Social Engineering Risk Calculation
  static async calculateSocialEngineeringRisk(metrics) {
    // This would integrate with social engineering simulation results
    // For now, using a simulated calculation
    const riskFactors = [];
    let score = 30; // Base score
    
    // Adjust based on available data
    if (metrics.socialEngineeringResults) {
      const failureRate = metrics.socialEngineeringResults.failures / metrics.socialEngineeringResults.total;
      score = Math.round(failureRate * 100);
      if (failureRate > 0.2) riskFactors.push('Social engineering vulnerability detected');
    } else {
      riskFactors.push('No social engineering assessment data');
      score = 50; // Neutral score when no data
    }
    
    return { score, riskFactors };
  }
  
  // Password Hygiene Calculation
  static calculatePasswordHygiene(metrics) {
    // Simulated password strength assessment
    // In production, this would integrate with password management systems
    const riskFactors = [];
    let score = 70; // Base assumption
    
    // Adjust based on policy compliance and training
    if (metrics.passwordChanges) {
      const recentChange = metrics.passwordChanges
        .filter(p => new Date(p.date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))
        .length > 0;
      
      if (!recentChange) {
        score -= 20;
        riskFactors.push('No recent password change');
      }
    }
    
    return { score: Math.max(0, score), riskFactors };
  }
  
  // Data Handling Risk Calculation
  static async calculateDataHandlingRisk(metrics) {
    const riskFactors = [];
    let score = 60; // Base score
    
    // Check data handling training completion
    if (metrics.trainingScores) {
      const dataHandlingTraining = metrics.trainingScores
        .filter(t => t.module.toLowerCase().includes('data') || t.module.toLowerCase().includes('handling'));
      
      if (dataHandlingTraining.length === 0) {
        score -= 20;
        riskFactors.push('No data handling training completed');
      } else {
        const avgScore = dataHandlingTraining.reduce((sum, t) => sum + t.score, 0) / dataHandlingTraining.length;
        if (avgScore < 70) {
          score -= 15;
          riskFactors.push('Low data handling training scores');
        }
      }
    }
    
    return { score: Math.max(0, score), riskFactors };
  }
  
  // Simulated technical dimension calculations
  static simulateDeviceSecurityScore(user) {
    // Base score with adjustments based on user role and department
    let score = 75;
    
    if (user.hviProfile.accessLevel === 'High' || user.hviProfile.accessLevel === 'Critical') {
      score += 10; // Higher scrutiny for privileged users
    }
    
    // Random variation to simulate real data
    score += (Math.random() * 10 - 5);
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }
  
  static simulateSoftwareCompliance(user) {
    let score = 80;
    
    if (user.hviProfile.department === 'IT' || user.hviProfile.department === 'Security') {
      score += 15;
    }
    
    score += (Math.random() * 10 - 5);
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }
  
  static simulateNetworkSecurity(user) {
    let score = 70;
    
    if (user.hviProfile.sensitivityLevel === 'Confidential' || user.hviProfile.sensitivityLevel === 'Restricted') {
      score += 20;
    }
    
    score += (Math.random() * 10 - 5);
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }
  
  static simulateAccessControl(user) {
    let score = 85;
    
    // Adjust based on access level
    switch (user.hviProfile.accessLevel) {
      case 'Low': score += 5; break;
      case 'High': score -= 10; break;
      case 'Critical': score -= 15; break;
    }
    
    score += (Math.random() * 10 - 5);
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }
  
  // Organizational dimension calculations
  static calculatePolicyCompliance(metrics) {
    const acknowledgements = metrics.policyAcknowledgements || [];
    const recentAcks = acknowledgements.filter(a => 
      new Date(a.date) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
    );
    
    if (recentAcks.length === 0) return 30;
    
    const complianceRate = recentAcks.filter(a => a.acknowledged).length / recentAcks.length;
    return Math.round(complianceRate * 100);
  }
  
  static calculateTrainingCompletion(metrics) {
    const trainingScores = metrics.trainingScores || [];
    const recentTraining = trainingScores.filter(t => 
      new Date(t.completionDate) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
    );
    
    if (recentTraining.length === 0) return 20;
    
    const avgScore = recentTraining.reduce((sum, t) => sum + t.score, 0) / recentTraining.length;
    return Math.round(avgScore);
  }
  
  static calculateIncidentResponse(metrics) {
    // This would integrate with incident response participation data
    // For now, using training scores as proxy
    const trainingScores = metrics.trainingScores || [];
    const incidentTraining = trainingScores.filter(t => 
      t.module.toLowerCase().includes('incident') || t.module.toLowerCase().includes('response')
    );
    
    if (incidentTraining.length === 0) return 40;
    
    const avgScore = incidentTraining.reduce((sum, t) => sum + t.score, 0) / incidentTraining.length;
    return Math.round(avgScore);
  }
  
  static calculateSecurityAwareness(metrics) {
    // Composite score based on multiple factors
    let score = 50;
    
    // Factor in phishing performance
    const phishingResults = metrics.simulatedPhishingResults || [];
    if (phishingResults.length > 0) {
      const recentPhishing = phishingResults.filter(r => 
        new Date(r.date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      );
      if (recentPhishing.length > 0) {
        const clickRate = recentPhishing.filter(r => r.clicked).length / recentPhishing.length;
        score += (1 - clickRate) * 30; // Higher score for lower click rate
      }
    }
    
    // Factor in training completion
    const trainingScores = metrics.trainingScores || [];
    if (trainingScores.length > 0) {
      const recentTraining = trainingScores.filter(t => 
        new Date(t.completionDate) > new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
      );
      if (recentTraining.length > 0) {
        const completionRate = recentTraining.length / 4; // Assuming 4 expected trainings
        score += completionRate * 20;
      }
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }
  
  // Environmental dimension calculations
  static calculateRemoteWorkRisk(user) {
    // Assess risk based on role and remote work frequency
    let score = 50;
    
    if (user.hviProfile.accessLevel === 'High' || user.hviProfile.accessLevel === 'Critical') {
      score += 20; // Higher risk for privileged remote access
    }
    
    if (user.hviProfile.sensitivityLevel === 'Confidential' || user.hviProfile.sensitivityLevel === 'Restricted') {
      score += 15; // Higher risk for sensitive data access
    }
    
    return Math.max(0, Math.min(100, score));
  }
  
  static calculatePhysicalSecurity(user) {
    // Base assessment - would integrate with physical access logs
    let score = 80;
    
    if (user.hviProfile.accessLevel === 'Critical') {
      score -= 10; // More scrutiny for critical access
    }
    
    return score;
  }
  
  static calculateThirdPartyRisk(user) {
    // Assess third-party access risk
    let score = 60;
    
    // Adjust based on department and external interactions
    if (user.hviProfile.department === 'Procurement' || user.hviProfile.department === 'Vendor Management') {
      score += 20;
    }
    
    return Math.max(0, Math.min(100, score));
  }
  
  static calculateComplianceRisk(user) {
    // Assess regulatory compliance risk
    let score = 70;
    
    // Higher risk for roles with compliance responsibilities
    if (user.hviProfile.department === 'Legal' || user.hviProfile.department === 'Compliance') {
      score += 15;
    }
    
    return Math.max(0, Math.min(100, score));
  }
  
  // Risk level determination
  static determineRiskLevel(score) {
    if (score >= 75) return 'Critical';
    if (score >= 50) return 'High';
    if (score >= 25) return 'Medium';
    return 'Low';
  }
  
  // Calculate confidence score for the assessment
  static calculateConfidenceScore(user) {
    let confidence = 70; // Base confidence
    
    // Increase confidence with more data points
    const metrics = user.hviProfile.behavioralMetrics || {};
    
    if (metrics.simulatedPhishingResults && metrics.simulatedPhishingResults.length > 2) {
      confidence += 10;
    }
    
    if (metrics.trainingScores && metrics.trainingScores.length > 3) {
      confidence += 10;
    }
    
    if (metrics.policyAcknowledgements && metrics.policyAcknowledgements.length > 1) {
      confidence += 10;
    }
    
    return Math.min(100, confidence);
  }
  
  // Analyze HVI trend over time
  static async analyzeTrend(user) {
    const history = user.hviProfile.hviHistory || [];
    
    if (history.length < 2) {
      return { trend: 'Insufficient data', change: 0, direction: 'stable' };
    }
    
    const recentScores = history.slice(-3).map(h => h.score.overallHVI);
    const currentScore = recentScores[recentScores.length - 1];
    const previousScore = recentScores[0];
    const change = currentScore - previousScore;
    
    let trend, direction;
    if (Math.abs(change) < 5) {
      trend = 'Stable';
      direction = 'stable';
    } else if (change > 0) {
      trend = 'Improving';
      direction = 'up';
    } else {
      trend = 'Deteriorating';
      direction = 'down';
    }
    
    return { trend, change: Math.abs(change), direction };
  }
  
  // Calculate peer comparison
  static async calculatePeerComparison(user) {
    try {
      const peers = await User.find({
        'hviProfile.department': user.hviProfile.department,
        'hviProfile.currentHVI': { $exists: true },
        '_id': { $ne: user._id }
      });
      
      if (peers.length === 0) {
        return { average: null, percentile: null, totalPeers: 0 };
      }
      
      const peerScores = peers.map(p => p.hviProfile.currentHVI.overallHVI);
      const average = Math.round(peerScores.reduce((sum, s) => sum + s, 0) / peerScores.length);
      
      // Calculate percentile
      const userScore = user.hviProfile.currentHVI?.overallHVI || 50;
      const lowerScores = peerScores.filter(s => s < userScore).length;
      const percentile = Math.round((lowerScores / peerScores.length) * 100);
      
      return {
        average,
        percentile,
        totalPeers: peers.length,
        comparison: userScore > average ? 'Above Average' : 'Below Average'
      };
    } catch (error) {
      console.error('Error calculating peer comparison:', error);
      return { average: null, percentile: null, totalPeers: 0 };
    }
  }
  
  // Recommendation generators for each dimension
  static generateBehavioralRecommendations(score) {
    const recommendations = [];
    
    if (score.components.phishingSusceptibility > 60) {
      recommendations.push({
        category: 'Behavioral',
        priority: 'High',
        action: 'Complete advanced phishing awareness training',
        impact: 'Reduce phishing susceptibility by 20-30%',
        timeline: '2 weeks'
      });
    }
    
    if (score.components.socialEngineeringRisk > 50) {
      recommendations.push({
        category: 'Behavioral',
        priority: 'Medium',
        action: 'Participate in social engineering simulation',
        impact: 'Improve social engineering detection',
        timeline: '1 month'
      });
    }
    
    return recommendations;
  }
  
  static generateTechnicalRecommendations(score) {
    const recommendations = [];
    
    if (score.components.deviceSecurity < 70) {
      recommendations.push({
        category: 'Technical',
        priority: 'High',
        action: 'Review and update device security settings',
        impact: 'Improve device security posture',
        timeline: '1 week'
      });
    }
    
    return recommendations;
  }
  
  static generateOrganizationalRecommendations(score) {
    const recommendations = [];
    
    if (score.components.trainingCompletion < 80) {
      recommendations.push({
        category: 'Organizational',
        priority: 'Medium',
        action: 'Complete mandatory security training modules',
        impact: 'Increase training compliance score',
        timeline: '2 weeks'
      });
    }
    
    return recommendations;
  }
  
  static generateEnvironmentalRecommendations(score) {
    const recommendations = [];
    
    if (score.components.remoteWorkRisk > 60) {
      recommendations.push({
        category: 'Environmental',
        priority: 'Low',
        action: 'Review remote work security protocols',
        impact: 'Mitigate remote work risks',
        timeline: '1 month'
      });
    }
    
    return recommendations;
  }
}

module.exports = HVIScoringEngine;
