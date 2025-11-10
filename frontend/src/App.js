import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import UserAssessments from './components/UserAssessments';
import './App.css';

const AppContent = () => {
    const { user, isAuthenticated } = useAuth();
    const [authMode, setAuthMode] = useState('login');

    if (isAuthenticated && user) {
        return <Dashboard />;
    }

    return (
        <div className="App">
            {authMode === 'login' ? (
                <Login onToggleMode={() => setAuthMode('register')} />
            ) : (
                <Register onToggleMode={() => setAuthMode('login')} />
            )}
        </div>
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
