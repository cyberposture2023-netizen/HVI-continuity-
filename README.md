# HVI Continuity Platform

## Overview
Healthcare Vulnerability Index (HVI) Continuity Platform with D1-D4 scoring system.

## Architecture
- Backend: Node.js/Express on port 5000
- Frontend: React on port 3000  
- Database: MongoDB
- Scoring: D1-D4 maturity model

## D1-D4 Scoring System
- D1: Foundational capabilities
- D2: Developing capabilities  
- D3: Advanced capabilities
- D4: Optimized capabilities

## Current Status
- Basic project structure created
- Backend and frontend foundations in place
- Missing endpoints to be implemented:
  - /api/dashboard/score-trend
  - /api/dashboard/scores  
  - /api/assessments/current
- Dashboard trends and assessment workflow need implementation
- Login screen needs completion

## Next Steps
1. Implement data models for assessments and scores
2. Build D1-D4 scoring algorithms
3. Create dashboard trend visualizations
4. Complete assessment workflow
5. Fix login authentication
