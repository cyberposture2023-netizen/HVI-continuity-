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
