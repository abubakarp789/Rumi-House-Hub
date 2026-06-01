import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login, user, authError, setAuthError } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'executive') navigate('/executive');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (location.search.includes('expired=true')) {
      setAuthError('Your authentication session has expired. Please sign in again.');
    } else {
      setAuthError('');
    }
  }, [location, setAuthError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setAuthError('Email and password are required.');
      return;
    }

    try {
      setLoading(true);
      const loggedUser = await login(formData.email, formData.password);

      if (loggedUser.role === 'admin') navigate('/admin');
      else if (loggedUser.role === 'executive') navigate('/executive');
      else navigate('/dashboard');
    } catch (err) {
      // AuthContext owns the visible error state.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-150px)] flex flex-col justify-center items-center px-margin-mobile md:px-margin-desktop py-12 relative">
      <div className="fixed inset-0 campus-grid pointer-events-none opacity-5"></div>
      
      <div className="max-w-[440px] w-full flex flex-col items-center z-10">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-white border border-outline-variant rounded-full shadow-sm">
            <img 
              alt="Namal Crest" 
              className="w-16 h-16 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIMQux_cb2RMNu20L98dAdR1LXHoUlNhEPKNA1cDgw00uJ-4PRLZ4D_T-_X-M-Gjc5IyXbvx9Ipg3D3qOWOW2yvrgrfiegaxFaBKdG9syTacWUxiilkGrU6Z15OFf6jLMYD3UBrnagpHBVwEmGox_MPRYq4U-T4GqkoCKzZ7lQOwddY1gZ42zPj78VowpKv9VmCTmvRs_HZLXsa0hS-JAKr_mL1zhMM9V4U8aXG9vNoe3jqBb5ZQs63auuWy3-dKWbduVfMLp036_c"
            />
          </div>
          <h1 className="font-display-lg text-display-lg text-primary mb-2">Rumi House Hub</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[320px] mx-auto font-semibold">
            Sign in to access your student portal or administrative dashboard.
          </p>
        </div>

        <div className="w-full bg-white border border-outline-variant p-8 md:p-10 shadow-sm">
          {authError && (
            <div className="p-4 mb-6 bg-error-container text-on-error-container border border-error text-xs rounded" role="alert">
              {authError}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6" aria-label="Sign In Form">
            <div>
              <label className="block font-label-uppercase text-label-uppercase text-on-surface-variant mb-3 font-bold" htmlFor="login-email">
                Institutional Email
              </label>
              <div className="relative">
                <input 
                  className="w-full bg-surface px-4 py-3 border border-outline-variant focus:border-primary focus:ring-0 transition-all font-body-md text-body-md outline-none text-on-background" 
                  id="login-email" 
                  name="email" 
                  placeholder="username@namal.edu.pk" 
                  required 
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-xl">
                  mail
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block font-label-uppercase text-label-uppercase text-on-surface-variant font-bold" htmlFor="login-password">
                  Secure Password
                </label>
                <Link to="#" className="font-label-uppercase text-label-uppercase text-primary hover:underline transition-all text-xs font-semibold">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input 
                  className="w-full bg-surface px-4 py-3 border border-outline-variant focus:border-primary focus:ring-0 transition-all font-body-md text-body-md outline-none text-on-background" 
                  id="login-password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <span 
                  className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant cursor-pointer text-xl" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </div>
            </div>

            <div className="flex items-center pt-2">
              <input className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary" id="remember" type="checkbox" />
              <label className="ml-2 font-body-sm text-body-sm text-on-surface-variant font-medium" htmlFor="remember">
                Remember my credentials for 30 days
              </label>
            </div>

            <button 
              className="w-full bg-primary hover:bg-primary-container text-white py-4 font-label-uppercase text-label-uppercase tracking-widest transition-all duration-200 shadow-sm uppercase font-bold" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'AUTHORIZING ACCESS...' : 'Authorize Access'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-outline-variant text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">New to the academic portal?</p>
            <Link className="inline-flex items-center gap-2 font-label-uppercase text-label-uppercase text-primary hover:gap-3 transition-all font-bold" to="/register">
              Create a Student Account
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Development Sandbox Credentials Panel */}
        <div className="w-full mt-6 bg-surface-container-low border border-outline-variant/60 p-5 rounded-lg text-xs leading-relaxed">
          <strong className="text-secondary font-bold text-xs uppercase tracking-wider block mb-2">Administrative Sandbox Credentials</strong>
          <ul className="list-disc pl-4 space-y-1 text-on-surface-variant font-medium">
            <li>Student Role: <code>student@namal.edu.pk</code> (Password: <code>student123</code>)</li>
            <li>Executive Role: <code>executive@namal.edu.pk</code> (Password: <code>executive123</code>)</li>
            <li>Administrator Role: <code>admin@namal.edu.pk</code> (Password: <code>admin123</code>)</li>
          </ul>
        </div>

        <footer className="mt-12 text-center">
          <p className="font-label-uppercase text-[10px] text-on-surface-variant tracking-[0.2em] opacity-60 font-semibold">
            SECURED BY NAMAL IT SERVICES • PORTAL V2.4.0
          </p>
        </footer>
      </div>
    </div>
  );
}
