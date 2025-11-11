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
