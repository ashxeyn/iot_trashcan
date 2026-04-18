import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import HistoryLog from './pages/HistoryLog';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
        {/* Only show navigation if authenticated */}
        {isAuthenticated && <Navbar />}

        <div className="flex-1 overflow-auto pb-20 md:pb-0">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes Mock */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/history" element={isAuthenticated ? <HistoryLog /> : <Navigate to="/login" />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
