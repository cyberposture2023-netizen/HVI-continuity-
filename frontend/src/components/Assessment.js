import React, { useState, useEffect } from 'react';
import { assessmentQuestions, dimensionOrder } from '../data/assessmentData';
import './Assessment.css';

const Assessment = ({ organizationId = '69129508927a2d85d97044cd' }) => {
  const [currentDimension, setCurrentDimension] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [saving, setSaving] = useState(false);

  const dimensionId = dimensionOrder[currentDimension];
  const dimension = assessmentQuestions.dimensions[dimensionId];
  const question = dimension.questions[currentQuestion];
  
  // Calculate progress
  const totalQuestions = dimensionOrder.reduce((total, dim) => 
    total + assessmentQuestions.dimensions[dim].questions.length, 0
  );
  const answeredQuestions = Object.keys(responses).length;
  const progress = Math.round((answeredQuestions / totalQuestions) * 100);

  const handleAnswer = (answer) => {
    const questionId = question.id;
    const newResponses = { ...responses, [questionId]: answer };
    setResponses(newResponses);

    // Simulate saving
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      goToNextQuestion();
    }, 500);
  };

  const goToNextQuestion = () => {
    if (currentQuestion < dimension.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentDimension < dimensionOrder.length - 1) {
      setCurrentDimension(currentDimension + 1);
      setCurrentQuestion(0);
    } else {
      completeAssessment();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentDimension > 0) {
      const prevDimension = dimensionOrder[currentDimension - 1];
      const prevDimensionQuestions = assessmentQuestions.dimensions[prevDimension].questions;
      setCurrentDimension(currentDimension - 1);
      setCurrentQuestion(prevDimensionQuestions.length - 1);
    }
  };

  const completeAssessment = () => {
    setSaving(true);
    setTimeout(() => {
      alert('Assessment completed! Your D1-D4 scores have been calculated.');
      window.location.href = '/';
    }, 1000);
  };

  const navigateToDimension = (dimIndex, questionIndex = 0) => {
    setCurrentDimension(dimIndex);
    setCurrentQuestion(questionIndex);
  };

  return (
    <div className="assessment">
      {/* Header */}
      <header className="assessment-header">
        <h1>Digital Continuity Assessment</h1>
        <div className="assessment-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">{answeredQuestions}/{totalQuestions}</span>
        </div>
      </header>

      <div className="assessment-container">
        {/* Dimension Navigation */}
        <nav className="dimension-nav">
          {dimensionOrder.map((dimId, index) => {
            const dim = assessmentQuestions.dimensions[dimId];
            const dimQuestions = dim.questions;
            const answeredCount = dimQuestions.filter(q => responses[q.id]).length;
            const isCurrent = index === currentDimension;
            
            return (
              <button
                key={dimId}
                className={`dimension-tab ${isCurrent ? 'active' : ''}`}
                onClick={() => navigateToDimension(index)}
              >
                <span className="dimension-abbr">{dimId.toUpperCase()}</span>
                <span className="dimension-name">{dim.name}</span>
                <span className="dimension-progress">
                  {answeredCount}/{dimQuestions.length}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Current Question */}
        <div className="question-section">
          <div className="dimension-info">
            <h2>{dimension.name}</h2>
            <p className="dimension-description">{dimension.description}</p>
            <div className="question-progress">
              Question {currentQuestion + 1} of {dimension.questions.length}
            </div>
          </div>

          <div className="question-card">
            <h3 className="question-text">{question.text}</h3>
            
            <div className="answer-options">
              {question.options.map((option, index) => {
                const isSelected = responses[question.id] === option.value;
                return (
                  <button
                    key={index}
                    className={`answer-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleAnswer(option.value)}
                    disabled={saving}
                  >
                    <span className="option-value">{option.value}</span>
                    <span className="option-label">{option.label}</span>
                    {isSelected && <span className="checkmark">✓</span>}
                  </button>
                );
              })}
            </div>

            <div className="question-navigation">
              <button 
                className="nav-button prev"
                onClick={goToPreviousQuestion}
                disabled={currentDimension === 0 && currentQuestion === 0 || saving}
              >
                ← Previous
              </button>
              
              <div className="question-indicator">
                D{currentDimension + 1}.{currentQuestion + 1}
              </div>

              {currentDimension === dimensionOrder.length - 1 && 
               currentQuestion === dimension.questions.length - 1 ? (
                <button 
                  className="nav-button complete"
                  onClick={completeAssessment}
                  disabled={saving}
                >
                  {saving ? 'Calculating...' : 'Complete Assessment'}
                </button>
              ) : (
                <button 
                  className="nav-button next"
                  onClick={goToNextQuestion}
                  disabled={saving}
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="quick-nav">
          <h4>Quick Navigation</h4>
          <div className="dimension-quick-links">
            {dimensionOrder.map((dimId, dimIndex) => {
              const dim = assessmentQuestions.dimensions[dimId];
              return (
                <div key={dimId} className="dimension-quick">
                  <span className="quick-dim-name">{dim.name}</span>
                  <div className="question-links">
                    {dim.questions.map((q, qIndex) => (
                      <button
                        key={q.id}
                        className={`question-link ${responses[q.id] ? 'answered' : ''} ${dimIndex === currentDimension && qIndex === currentQuestion ? 'current' : ''}`}
                        onClick={() => navigateToDimension(dimIndex, qIndex)}
                      >
                        {qIndex + 1}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {saving && (
        <div className="saving-overlay">
          <div className="saving-spinner"></div>
          <span>Saving response...</span>
        </div>
      )}
    </div>
  );
};

export default Assessment;
