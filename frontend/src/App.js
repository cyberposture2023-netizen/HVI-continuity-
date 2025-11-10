import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';
import Dashboard from './pages/Dashboard';
import AssessmentPage from './pages/AssessmentPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Add other routes here as needed */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;



