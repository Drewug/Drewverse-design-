import React, { useState } from 'react';
import { ViewMode } from '../types';
import { Lock, ArrowLeft } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onBack }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate Supabase Auth delay
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-4 relative">
       <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-brand-green transition-colors"
       >
         <ArrowLeft size={18} /> Back to Home
       </button>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-green/10 text-brand-green rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock size={24} />
          </div>
          <h2 className="text-2xl font-bold text-brand-dark">Admin Portal</h2>
          <p className="text-gray-500 mt-2 text-sm">Sign in to manage DrewVerse Design.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              defaultValue="admin@drewverse.com"
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green bg-gray-50 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Password</label>
            <input 
              type="password" 
              required
              defaultValue="password"
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green bg-gray-50 transition-all"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-green text-white py-4 rounded-xl font-bold hover:bg-brand-greenLight transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">Protected by Supabase Auth</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;