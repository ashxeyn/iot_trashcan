import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
        const response = await axios.post(`${apiUrl}/api/login`, {
            email,
            password
        });
        
        if (response.data.success) {
            localStorage.setItem('auth_token', response.data.token);
            // hard refresh or event to trigger App.jsx update
            window.location.href = '/dashboard';
        }
    } catch (err) {
        if (err.response && err.response.data && err.response.data.errors) {
            setError(err.response.data.errors.email[0]);
        } else {
            setError('Login failed. Please try again.');
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Portal</h1>
          <p className="text-gray-500 mt-1">Smart Waste Management System</p>
        </div>

        {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 focus:bg-white transition-colors outline-none"
                placeholder="admin@wmsu.edu.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 focus:bg-white transition-colors outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70"
          >
            {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
                'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
