import React, { useState } from 'react';
import { useStore } from '../store';

export const AuthPage = ({ mode = 'login' }) => {
  const [currentMode, setCurrentMode] = useState(mode); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const setUser = useStore((state) => state.setUser);
  const setCurrentView = useStore((state) => state.setCurrentView);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Simple validation
    if (!email || !password || (currentMode === 'register' && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
    const endpoint = currentMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = currentMode === 'login' 
      ? { email, password } 
      : { email, password, name };

    try {
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      // Success
      setUser(data.user, data.token);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Decorative blurred backgrounds */}
      <div className="auth-glow-1"></div>
      <div className="auth-glow-2"></div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-icon inline-logo" onClick={() => setCurrentView('landing')}>V</div>
          <h2>{currentMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="auth-subtitle">
            {currentMode === 'login' 
              ? 'Enter your credentials to access your workflows' 
              : 'Sign up to build and save custom nodes and DAGs'}
          </p>
        </div>

        {error && (
          <div className="auth-error-alert">
            <span className="error-icon">!</span>
            <span className="error-text">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {currentMode === 'register' && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="btn-spinner"></span>
            ) : currentMode === 'login' ? (
              'Sign In to Workspace'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          {currentMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button className="auth-switch-btn" onClick={() => { setCurrentMode('register'); setError(null); }}>
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button className="auth-switch-btn" onClick={() => { setCurrentMode('login'); setError(null); }}>
                Log In
              </button>
            </p>
          )}
          <button className="auth-back-btn" onClick={() => setCurrentView('landing')}>
            &larr; Back to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
};
