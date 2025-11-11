// D1-D4 Scoring Algorithm
function calculateD1D4Scores(responses) {
  // Initialize scores
  const domainScores = {};
  const dimensionScores = { d1: 0, d2: 0, d3: 0, d4: 0 };
  const dimensionCounts = { d1: 0, d2: 0, d3: 0, d4: 0 };

  // Calculate domain scores and map to dimensions
  responses.forEach(response => {
    const { domain, answer } = response;
    
    // Initialize domain if not exists
    if (!domainScores[domain]) {
      domainScores[domain] = { total: 0, count: 0 };
    }
    
    // Add to domain score (convert 1-5 scale to 0-100)
    const normalizedScore = (answer - 1) * 25; // 1=0, 2=25, 3=50, 4=75, 5=100
    domainScores[domain].total += normalizedScore;
    domainScores[domain].count += 1;
    
    // Map domain to dimension and add to dimension score
    const dimension = mapDomainToDimension(domain);
    if (dimension) {
      dimensionScores[dimension] += normalizedScore;
      dimensionCounts[dimension] += 1;
    }
  });

  // Calculate average domain scores
  const finalDomainScores = {};
  Object.keys(domainScores).forEach(domain => {
    finalDomainScores[domain] = domainScores[domain].count > 0 
      ? Math.round(domainScores[domain].total / domainScores[domain].count)
      : 0;
  });

  // Calculate average dimension scores
  Object.keys(dimensionScores).forEach(dimension => {
    dimensionScores[dimension] = dimensionCounts[dimension] > 0
      ? Math.round(dimensionScores[dimension] / dimensionCounts[dimension])
      : 0;
  });

  // Calculate overall score (average of dimensions)
  const overallScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0) / 4;

  return {
    overall: Math.round(overallScore),
    dimensions: dimensionScores,
    domains: finalDomainScores
  };
}

// Map domains to D1-D4 dimensions
function mapDomainToDimension(domain) {
  const domainMap = {
    // D1: Leadership & Governance
    'governance': 'd1',
    'strategy': 'd1',
    'leadership': 'd1',
    'compliance': 'd1',
    
    // D2: Technology & Infrastructure  
    'technology': 'd2',
    'infrastructure': 'd2',
    'security': 'd2',
    'systems': 'd2',
    
    // D3: Process & Operations
    'processes': 'd3',
    'operations': 'd3',
    'workflows': 'd3',
    'procedures': 'd3',
    
    // D4: People & Culture
    'people': 'd4',
    'culture': 'd4',
    'training': 'd4',
    'skills': 'd4'
  };
  
  return domainMap[domain.toLowerCase()] || null;
}

module.exports = { calculateD1D4Scores };
