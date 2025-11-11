// D1-D4 Assessment Questions
export const assessmentQuestions = {
  dimensions: {
    d1: {
      name: 'Leadership & Governance',
      description: 'Executive sponsorship, digital strategy, and governance frameworks',
      questions: [
        {
          id: 'd1_q1',
          text: 'How strongly does executive leadership champion digital continuity initiatives?',
          options: [
            { value: 1, label: 'No executive sponsorship' },
            { value: 2, label: 'Limited executive awareness' },
            { value: 3, label: 'Moderate executive support' },
            { value: 4, label: 'Strong executive sponsorship' },
            { value: 5, label: 'Executive-driven digital continuity culture' }
          ]
        },
        {
          id: 'd1_q2',
          text: 'How comprehensive is your digital continuity strategy and roadmap?',
          options: [
            { value: 1, label: 'No formal strategy' },
            { value: 2, label: 'Basic awareness, no formal plan' },
            { value: 3, label: 'Developing strategy document' },
            { value: 4, label: 'Comprehensive strategy in place' },
            { value: 5, label: 'Strategy integrated with business objectives' }
          ]
        },
        {
          id: 'd1_q3',
          text: 'How mature are your digital governance frameworks and policies?',
          options: [
            { value: 1, label: 'No governance framework' },
            { value: 2, label: 'Basic policies under development' },
            { value: 3, label: 'Standardized policies in place' },
            { value: 4, label: 'Comprehensive governance framework' },
            { value: 5, label: 'Continuous governance optimization' }
          ]
        },
        {
          id: 'd1_q4',
          text: 'How effective is your digital continuity risk management?',
          options: [
            { value: 1, label: 'No risk assessment process' },
            { value: 2, label: 'Ad-hoc risk identification' },
            { value: 3, label: 'Regular risk assessments' },
            { value: 4, label: 'Integrated risk management' },
            { value: 5, label: 'Predictive risk analytics' }
          ]
        }
      ]
    },
    d2: {
      name: 'Technology & Infrastructure',
      description: 'Systems, security, data management, and technical capabilities',
      questions: [
        {
          id: 'd2_q1',
          text: 'How robust is your digital preservation infrastructure?',
          options: [
            { value: 1, label: 'No dedicated infrastructure' },
            { value: 2, label: 'Basic storage solutions' },
            { value: 3, label: 'Standardized preservation systems' },
            { value: 4, label: 'Advanced preservation platform' },
            { value: 5, label: 'Cutting-edge preservation ecosystem' }
          ]
        },
        {
          id: 'd2_q2',
          text: 'How comprehensive are your data integrity and validation processes?',
          options: [
            { value: 1, label: 'No data integrity measures' },
            { value: 2, label: 'Manual validation processes' },
            { value: 3, label: 'Automated basic validation' },
            { value: 4, label: 'Comprehensive integrity framework' },
            { value: 5, label: 'Real-time integrity monitoring' }
          ]
        },
        {
          id: 'd2_q3',
          text: 'How mature is your digital security and access control?',
          options: [
            { value: 1, label: 'No security framework' },
            { value: 2, label: 'Basic access controls' },
            { value: 3, label: 'Standard security protocols' },
            { value: 4, label: 'Advanced security measures' },
            { value: 5, label: 'Zero-trust security architecture' }
          ]
        },
        {
          id: 'd2_q4',
          text: 'How effective is your technology lifecycle management?',
          options: [
            { value: 1, label: 'No lifecycle management' },
            { value: 2, label: 'Reactive technology updates' },
            { value: 3, label: 'Scheduled technology refresh' },
            { value: 4, label: 'Proactive lifecycle planning' },
            { value: 5, label: 'Continuous technology optimization' }
          ]
        }
      ]
    },
    d3: {
      name: 'Process & Operations',
      description: 'Workflows, procedures, operational excellence, and continuous improvement',
      questions: [
        {
          id: 'd3_q1',
          text: 'How standardized are your digital continuity processes?',
          options: [
            { value: 1, label: 'No standardized processes' },
            { value: 2, label: 'Basic process documentation' },
            { value: 3, label: 'Standardized workflows' },
            { value: 4, label: 'Optimized processes' },
            { value: 5, label: 'Continuously improved processes' }
          ]
        },
        {
          id: 'd3_q2',
          text: 'How mature is your digital asset management?',
          options: [
            { value: 1, label: 'No asset management' },
            { value: 2, label: 'Manual asset tracking' },
            { value: 3, label: 'Basic digital asset system' },
            { value: 4, label: 'Comprehensive asset management' },
            { value: 5, label: 'Intelligent asset lifecycle management' }
          ]
        },
        {
          id: 'd3_q3',
          text: 'How effective are your continuity monitoring and alerting systems?',
          options: [
            { value: 1, label: 'No monitoring in place' },
            { value: 2, label: 'Basic manual monitoring' },
            { value: 3, label: 'Automated monitoring' },
            { value: 4, label: 'Advanced alerting systems' },
            { value: 5, label: 'Predictive monitoring and AIOps' }
          ]
        },
        {
          id: 'd3_q4',
          text: 'How comprehensive is your incident response and recovery capability?',
          options: [
            { value: 1, label: 'No response plan' },
            { value: 2, label: 'Basic response procedures' },
            { value: 3, label: 'Documented response plans' },
            { value: 4, label: 'Tested recovery procedures' },
            { value: 5, label: 'Automated recovery orchestration' }
          ]
        }
      ]
    },
    d4: {
      name: 'People & Culture',
      description: 'Skills, training, organizational culture, and change management',
      questions: [
        {
          id: 'd4_q1',
          text: 'How developed are digital continuity skills across the organization?',
          options: [
            { value: 1, label: 'No specific skills development' },
            { value: 2, label: 'Basic awareness training' },
            { value: 3, label: 'Structured skills development' },
            { value: 4, label: 'Advanced competency programs' },
            { value: 5, label: 'Continuous learning culture' }
          ]
        },
        {
          id: 'd4_q2',
          text: 'How strong is the digital continuity culture and mindset?',
          options: [
            { value: 1, label: 'No cultural awareness' },
            { value: 2, label: 'Limited cultural adoption' },
            { value: 3, label: 'Growing cultural acceptance' },
            { value: 4, label: 'Strong cultural integration' },
            { value: 5, label: 'Digital continuity as core value' }
          ]
        },
        {
          id: 'd4_q3',
          text: 'How effective is your change management for digital initiatives?',
          options: [
            { value: 1, label: 'No change management process' },
            { value: 2, label: 'Ad-hoc change handling' },
            { value: 3, label: 'Structured change processes' },
            { value: 4, label: 'Integrated change management' },
            { value: 5, label: 'Change-adaptive organization' }
          ]
        },
        {
          id: 'd4_q4',
          text: 'How comprehensive are your collaboration and knowledge sharing practices?',
          options: [
            { value: 1, label: 'No collaboration framework' },
            { value: 2, label: 'Limited knowledge sharing' },
            { value: 3, label: 'Basic collaboration tools' },
            { value: 4, label: 'Integrated collaboration ecosystem' },
            { value: 5, label: 'Continuous knowledge innovation' }
          ]
        }
      ]
    }
  }
};

export const dimensionOrder = ['d1', 'd2', 'd3', 'd4'];
