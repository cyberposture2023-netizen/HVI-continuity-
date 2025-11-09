const questions = {
  D1: [
    {
      id: 'D1_Q1',
      text: 'How often do you click on links or attachments in unsolicited emails?',
      dimension: 'D1',
      options: [
        { id: 'never', text: 'Never', score: 5 },
        { id: 'rarely', text: 'Rarely', score: 4 },
        { id: 'sometimes', text: 'Sometimes', score: 3 },
        { id: 'often', text: 'Often', score: 2 },
        { id: 'always', text: 'Always', score: 1 }
      ]
    },
    {
      id: 'D1_Q2',
      text: 'Do you use unique passwords for different online accounts?',
      dimension: 'D1',
      options: [
        { id: 'always', text: 'Always', score: 5 },
        { id: 'mostly', text: 'Mostly', score: 4 },
        { id: 'sometimes', text: 'Sometimes', score: 3 },
        { id: 'rarely', text: 'Rarely', score: 2 },
        { id: 'never', text: 'Never', score: 1 }
      ]
    },
    {
      id: 'D1_Q3',
      text: 'How likely are you to report a suspicious email to your IT department?',
      dimension: 'D1',
      options: [
        { id: 'very_likely', text: 'Very Likely', score: 5 },
        { id: 'likely', text: 'Likely', score: 4 },
        { id: 'neutral', text: 'Neutral', score: 3 },
        { id: 'unlikely', text: 'Unlikely', score: 2 },
        { id: 'very_unlikely', text: 'Very Unlikely', score: 1 }
      ]
    }
  ],
  D2: [
    {
      id: 'D2_Q1',
      text: 'Do you regularly update your software and applications?',
      dimension: 'D2',
      options: [
        { id: 'always', text: 'Always', score: 5 },
        { id: 'mostly', text: 'Mostly', score: 4 },
        { id: 'sometimes', text: 'Sometimes', score: 3 },
        { id: 'rarely', text: 'Rarely', score: 2 },
        { id: 'never', text: 'Never', score: 1 }
      ]
    },
    {
      id: 'D2_Q2',
      text: 'How familiar are you with multi-factor authentication?',
      dimension: 'D2',
      options: [
        { id: 'expert', text: 'Expert', score: 5 },
        { id: 'comfortable', text: 'Comfortable', score: 4 },
        { id: 'basic', text: 'Basic Knowledge', score: 3 },
        { id: 'heard', text: 'Heard of It', score: 2 },
        { id: 'unfamiliar', text: 'Unfamiliar', score: 1 }
      ]
    }
  ],
  D3: [
    {
      id: 'D3_Q1',
      text: 'Does your organization provide regular cybersecurity training?',
      dimension: 'D3',
      options: [
        { id: 'monthly', text: 'Monthly', score: 5 },
        { id: 'quarterly', text: 'Quarterly', score: 4 },
        { id: 'yearly', text: 'Yearly', score: 3 },
        { id: 'rarely', text: 'Rarely', score: 2 },
        { id: 'never', text: 'Never', score: 1 }
      ]
    }
  ],
  D4: [
    {
      id: 'D4_Q1',
      text: 'How secure is your physical work environment?',
      dimension: 'D4',
      options: [
        { id: 'very_secure', text: 'Very Secure', score: 5 },
        { id: 'secure', text: 'Secure', score: 4 },
        { id: 'moderate', text: 'Moderate', score: 3 },
        { id: 'insecure', text: 'Insecure', score: 2 },
        { id: 'very_insecure', text: 'Very Insecure', score: 1 }
      ]
    }
  ]
};

// Helper function to get questions by dimension
function getQuestionsByDimension(dimension) {
  return questions[dimension] || [];
}

// Helper function to get all questions
function getAllQuestions() {
  return Object.values(questions).flat();
}

module.exports = {
  getQuestionsByDimension,
  getAllQuestions,
  questions
};
