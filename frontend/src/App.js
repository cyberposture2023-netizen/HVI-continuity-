import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Layout and Pages
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Assessments from './pages/Assessments/Assessments';
import Simulation from './pages/Simulation/Simulation';
import Reports from './pages/Reports/Reports';
import Users from './pages/Users/Users';
import Login from './pages/Auth/Login';

// Services
import { AuthProvider } from './services/AuthContext';

// Styles
import './App.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <div className="App">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/" element={<Layout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="assessments" element={<Assessments />} />
                                <Route path="simulation" element={<Simulation />} />
                                <Route path="reports" element={<Reports />} />
                                <Route path="users" element={<Users />} />
                            </Route>
                        </Routes>
                        <Toaster 
                            position="top-right"
                            toastOptions={{
                                duration: 4000,
                                style: {
                                    background: '#363636',
                                    color: '#fff',
                                },
                            }}
                        />
                    </div>
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;


