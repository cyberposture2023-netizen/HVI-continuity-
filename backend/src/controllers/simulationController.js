const { Simulation, User } = require('./models');
const mongoose = require('mongoose');

// Simulation Controller
class SimulationController {
  
  // Create new simulation
  static async createSimulation(simulationData) {
    try {
      const simulation = new Simulation(simulationData);
      await simulation.save();
      return simulation;
    } catch (error) {
      console.error('Error creating simulation:', error);
      throw error;
    }
  }
  
  // Launch simulation for target group
  static async launchSimulation(simulationId) {
    try {
      const simulation = await Simulation.findById(simulationId);
      if (!simulation) {
        throw new Error('Simulation not found');
      }
      
      // Get users in target group
      const targetUsers = await User.find({
        'hviProfile.department': { $in: simulation.targetGroup.map(tg => tg.department) },
        'hviProfile.jobRole': { $in: simulation.targetGroup.map(tg => tg.role) },
        'isActive': true
      });
      
      // Initialize participant tracking
      simulation.participants = targetUsers.map(user => ({
        userId: user._id,
        startTime: null,
        endTime: null,
        actions: [],
        finalScore: 0,
        riskIndicators: [],
        behavioralInsights: {}
      }));
      
      simulation.status = 'Running';
      simulation.scheduledStart = new Date();
      await simulation.save();
      
      return { simulation, participants: targetUsers.length };
    } catch (error) {
      console.error('Error launching simulation:', error);
      throw error;
    }
  }
  
  // Record participant action in simulation
  static async recordAction(simulationId, userId, actionData) {
    try {
      const simulation = await Simulation.findById(simulationId);
      if (!simulation) {
        throw new Error('Simulation not found');
      }
      
      const participant = simulation.participants.find(p => p.userId.toString() === userId);
      if (!participant) {
        throw new Error('Participant not found in simulation');
      }
      
      // Record action with timestamp
      participant.actions.push({
        timestamp: new Date(),
        action: actionData.action,
        outcome: actionData.outcome,
        scoreImpact: actionData.scoreImpact || 0
      });
      
      // Update behavioral insights
      this.updateBehavioralInsights(participant, actionData);
      
      await simulation.save();
      return participant;
    } catch (error) {
      console.error('Error recording action:', error);
      throw error;
    }
  }
  
  // Update behavioral insights based on actions
  static updateBehavioralInsights(participant, actionData) {
    if (!participant.behavioralInsights) {
      participant.behavioralInsights = {
        responseTimes: [],
        riskPatterns: [],
        decisionMaking: [],
        complianceLevel: 0
      };
    }
    
    // Analyze response time if available
    if (actionData.responseTime) {
      participant.behavioralInsights.responseTimes.push(actionData.responseTime);
    }
    
    // Detect risk patterns
    if (actionData.outcome === 'high_risk') {
      participant.riskIndicators.push(actionData.action);
    }
    
    // Update compliance level
    if (actionData.outcome === 'compliant') {
      participant.behavioralInsights.complianceLevel += 10;
    } else if (actionData.outcome === 'non_compliant') {
      participant.behavioralInsights.complianceLevel -= 15;
    }
    
    // Ensure compliance level stays within bounds
    participant.behavioralInsights.complianceLevel = Math.max(0, Math.min(100, participant.behavioralInsights.complianceLevel));
  }
  
  // Complete simulation for participant
  static async completeSimulation(simulationId, userId, finalData) {
    try {
      const simulation = await Simulation.findById(simulationId);
      const participant = simulation.participants.find(p => p.userId.toString() === userId);
      
      if (!participant) {
        throw new Error('Participant not found');
      }
      
      participant.endTime = new Date();
      participant.finalScore = this.calculateSimulationScore(participant);
      
      // Update user's behavioral metrics
      await this.updateUserBehavioralMetrics(userId, simulation, participant);
      
      await simulation.save();
      return participant;
    } catch (error) {
      console.error('Error completing simulation:', error);
      throw error;
    }
  }
  
  // Calculate final simulation score
  static calculateSimulationScore(participant) {
    let score = 100; // Start with perfect score
    
    // Deduct points for risky actions
    participant.actions.forEach(action => {
      if (action.scoreImpact) {
        score += action.scoreImpact; // scoreImpact can be negative
      }
    });
    
    // Bonus for compliance
    if (participant.behavioralInsights.complianceLevel > 80) {
      score += 10;
    }
    
    return Math.max(0, Math.min(100, score)); // Ensure score is between 0-100
  }
  
  // Update user's behavioral metrics with simulation results
  static async updateUserBehavioralMetrics(userId, simulation, participant) {
    try {
      const user = await User.findById(userId);
      
      if (!user.hviProfile.behavioralMetrics) {
        user.hviProfile.behavioralMetrics = {
          simulatedPhishingResults: [],
          trainingScores: [],
          policyAcknowledgements: []
        };
      }
      
      // Record phishing simulation results
      if (simulation.type === 'Phishing') {
        user.hviProfile.behavioralMetrics.simulatedPhishingResults.push({
          testId: simulation._id.toString(),
          date: new Date(),
          clicked: participant.actions.some(a => a.action === 'clicked_phishing_link'),
          reported: participant.actions.some(a => a.action === 'reported_phishing'),
          responseTime: participant.behavioralInsights.responseTimes.length > 0 
            ? Math.min(...participant.behavioralInsights.responseTimes)
            : null
        });
      }
      
      await user.save();
    } catch (error) {
      console.error('Error updating user behavioral metrics:', error);
      throw error;
    }
  }
  
  // Get simulation analytics
  static async getSimulationAnalytics(simulationId) {
    try {
      const simulation = await Simulation.findById(simulationId).populate('participants.userId');
      
      const analytics = {
        simulation: {
          id: simulation._id,
          title: simulation.title,
          type: simulation.type,
          status: simulation.status
        },
        participation: {
          total: simulation.participants.length,
          completed: simulation.participants.filter(p => p.endTime).length,
          inProgress: simulation.participants.filter(p => p.startTime && !p.endTime).length,
          notStarted: simulation.participants.filter(p => !p.startTime).length
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
        riskIndicators: {},
        behavioralInsights: {}
      };
      
      // Calculate score statistics
      const completedParticipants = simulation.participants.filter(p => p.endTime);
      if (completedParticipants.length > 0) {
        const scores = completedParticipants.map(p => p.finalScore);
        analytics.scores.average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        
        // Score distribution
        analytics.scores.distribution = {
          excellent: scores.filter(s => s >= 90).length,
          good: scores.filter(s => s >= 70 && s < 90).length,
          fair: scores.filter(s => s >= 50 && s < 70).length,
          poor: scores.filter(s => s < 50).length
        };
      }
      
      // Aggregate risk indicators
      const allRiskIndicators = completedParticipants.flatMap(p => p.riskIndicators);
      analytics.riskIndicators = allRiskIndicators.reduce((acc, indicator) => {
        acc[indicator] = (acc[indicator] || 0) + 1;
        return acc;
      }, {});
      
      return analytics;
    } catch (error) {
      console.error('Error getting simulation analytics:', error);
      throw error;
    }
  }
  
  // Get pre-built simulation templates
  static getSimulationTemplates() {
    return {
      phishing: {
        title: 'Advanced Phishing Simulation',
        type: 'Phishing',
        description: 'Comprehensive phishing awareness test with realistic email scenarios',
        scenario: {
          emails: [
            {
              id: 'phish_001',
              subject: 'Urgent: Password Reset Required',
              sender: 'IT Support <support@company-security.com>',
              content: 'Your password will expire in 24 hours. Click here to reset immediately.',
              difficulty: 'Medium',
              indicators: ['Urgent language', 'Suspicious sender domain', 'Generic greeting']
            },
            {
              id: 'phish_002',
              subject: 'Quarterly Bonus Notification',
              sender: 'HR Department <hr@yourcompany-bonus.com>',
              content: 'You have received a quarterly bonus. Login to view details.',
              difficulty: 'High',
              indicators: ['Too good to be true', 'Mismatched sender', 'Request for login']
            }
          ]
        },
        configuration: {
          duration: 24, // hours
          successCriteria: {
            reportRate: 80, // % of participants who should report phishing
            clickRate: 20   // Maximum acceptable click rate
          },
          scoringMatrix: {
            reportPhishing: 20,
            ignorePhishing: 0,
            clickLink: -30,
            enterCredentials: -50
          }
        }
      },
      
      socialEngineering: {
        title: 'Social Engineering Defense Test',
        type: 'Social Engineering',
        description: 'Simulated social engineering attacks via phone and in-person scenarios',
        scenario: {
          scenarios: [
            {
              id: 'se_001',
              type: 'phone',
              scenario: 'Caller claiming to be from IT needing remote access',
              difficulty: 'Medium',
              redFlags: ['Unscheduled request', 'Pressure to act quickly', 'Vague identity']
            },
            {
              id: 'se_002',
              type: 'in_person',
              scenario: 'Visitor without proper badge requesting access to secure area',
              difficulty: 'High',
              redFlags: ['No identification', 'Tailgating attempt', 'Vague purpose']
            }
          ]
        },
        configuration: {
          duration: 168, // 1 week
          successCriteria: {
            verificationRate: 90, // % who verify identity
            accessDeniedRate: 95   // % who deny unauthorized access
          },
          scoringMatrix: {
            verifyIdentity: 25,
            denyAccess: 30,
            reportIncident: 20,
            grantAccess: -40,
            shareInformation: -35
          }
        }
      },
      
      dataHandling: {
        title: 'Secure Data Handling Assessment',
        type: 'Data Handling',
        description: 'Test proper handling of sensitive and confidential information',
        scenario: {
          scenarios: [
            {
              id: 'dh_001',
              type: 'email',
              scenario: 'Request to send customer data to personal email',
              dataSensitivity: 'Confidential',
              correctAction: 'Deny request and report'
            },
            {
              id: 'dh_002',
              type: 'physical',
              scenario: 'Finding sensitive documents in common area',
              dataSensitivity: 'Restricted',
              correctAction: 'Secure documents and report finding'
            }
          ]
        },
        configuration: {
          duration: 48, // 2 days
          successCriteria: {
            properHandlingRate: 85,
            reportingRate: 90
          },
          scoringMatrix: {
            properHandling: 25,
            immediateReporting: 20,
            secureDisposal: 15,
            mishandling: -30,
            nonReporting: -25
          }
        }
      }
    };
  }
}

module.exports = SimulationController;
