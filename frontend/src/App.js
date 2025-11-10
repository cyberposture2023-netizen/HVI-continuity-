import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AssessmentTake from './components/AssessmentTake';
import './App.css';

const AppContent = () => {
    const { user, isAuthenticated } = useAuth();
    const [authMode, setAuthMode] = useState('login');

    if (!isAuthenticated) {
        return (
            <div className="App">
                {authMode === 'login' ? (
                    <Login onToggleMode={() => setAuthMode('register')} />
                ) : (
                    <Register onToggleMode={() => setAuthMode('login')} />
                )}
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/assessment/:assessmentId" element={<AssessmentTake />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
