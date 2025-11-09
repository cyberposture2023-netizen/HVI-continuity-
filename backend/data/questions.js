// Sample questions for each dimension
const assessmentQuestions = {
  behavioral: [
    {
      id: 'b1',
      text: 'How often do you click on links or attachments in unsolicited emails?',
      options: [
        { value: 'never', label: 'Never', score: 0 },
        { value: 'rarely', label: 'Rarely', score: 1 },
        { value: 'sometimes', label: 'Sometimes', score: 2 },
        { value: 'often', label: 'Often', score: 3 },
        { value: 'always', label: 'Always', score: 4 }
      ],
      category: 'phishing_awareness'
    },
    {
      id: 'b2',
      text: 'Do you use the same password for multiple accounts?',
      options: [
        { value: 'never', label: 'Never', score: 0 },
        { value: 'few', label: 'A few accounts', score: 2 },
        { value: 'many', label: 'Many accounts', score: 3 },
        { value: 'all', label: 'All accounts', score: 4 }
      ],
      category: 'password_hygiene'
    },
    {
      id: 'b3',
      text: 'How often do you update your passwords?',
      options: [
        { value: 'regularly', label: 'Every 3 months', score: 0 },
        { value: 'occasionally', label: 'Every 6 months', score: 1 },
        { value: 'rarely', label: 'Once a year', score: 3 },
        { value: 'never', label: 'Never', score: 4 }
      ],
      category: 'password_hygiene'
    }
  ],
  technical: [
    {
      id: 't1',
      text: 'Is multi-factor authentication (MFA) enabled on all your corporate accounts?',
      options: [
        { value: 'all', label: 'All accounts', score: 0 },
        { value: 'most', label: 'Most accounts', score: 1 },
        { value: 'some', label: 'Some accounts', score: 2 },
        { value: 'none', label: 'No accounts', score: 4 }
      ],
      category: 'authentication'
    },
    {
      id: 't2',
      text: 'How often do you update your software and applications?',
      options: [
        { value: 'immediately', label: 'As soon as updates are available', score: 0 },
        { value: 'weekly', label: 'Within a week', score: 1 },
        { value: 'monthly', label: 'Within a month', score: 2 },
        { value: 'rarely', label: 'Rarely or never', score: 4 }
      ],
      category: 'system_maintenance'
    }
  ],
  organizational: [
    {
      id: 'o1',
      text: 'Has your department conducted cybersecurity training in the last 6 months?',
      options: [
        { value: 'yes_recent', label: 'Yes, within 3 months', score: 0 },
        { value: 'yes_6months', label: 'Yes, within 6 months', score: 1 },
        { value: 'yes_year', label: 'Yes, over a year ago', score: 2 },
        { value: 'no', label: 'No training', score: 4 }
      ],
      category: 'training'
    },
    {
      id: 'o2',
      text: 'Are you familiar with your company\'s incident reporting procedures?',
      options: [
        { value: 'very', label: 'Very familiar', score: 0 },
        { value: 'somewhat', label: 'Somewhat familiar', score: 1 },
        { value: 'vaguely', label: 'Vaguely familiar', score: 3 },
        { value: 'not', label: 'Not familiar', score: 4 }
      ],
      category: 'policies'
    }
  ],
  environmental: [
    {
      id: 'e1',
      text: 'Do you work primarily from a public, unsecured Wi-Fi network?',
      options: [
        { value: 'never', label: 'Never', score: 0 },
        { value: 'rarely', label: 'Rarely', score: 1 },
        { value: 'sometimes', label: 'Sometimes', score: 2 },
        { value: 'often', label: 'Often', score: 3 },
        { value: 'always', label: 'Always', score: 4 }
      ],
      category: 'network_security'
    },
    {
      id: 'e2',
      text: 'How do you store sensitive physical documents?',
      options: [
        { value: 'locked', label: 'In locked cabinets', score: 0 },
        { value: 'secured', label: 'In secured areas', score: 1 },
        { value: 'desk', label: 'On desk or in open areas', score: 3 },
        { value: 'unsecured', label: 'No specific storage', score: 4 }
      ],
      category: 'physical_security'
    }
  ]
};

module.exports = assessmentQuestions;
