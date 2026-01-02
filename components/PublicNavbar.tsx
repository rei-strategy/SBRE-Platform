
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';

interface PublicNavbarProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogin?: any; // Legacy compatibility
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ onOpenAuth }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-11 w-auto flex items-center justify-center">
            <img src="/sbre-logo.png" alt="SBRE platform logo" className="h-full w-auto object-contain" />
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link to="/how-it-works" className="hover:text-blue-700 text-blue-600 transition-colors">How it works</Link>
          <Link to="/platform" className="hover:text-blue-700 text-blue-600 transition-colors">Platform</Link>
          <Link to="/vendor-benefits" className="hover:text-blue-700 text-blue-600 transition-colors">Vendors</Link>
          <Link to="/pricing" className="hover:text-blue-700 transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => onOpenAuth('login')} className="text-sm font-bold text-slate-600 hover:text-slate-900 hidden md:block">
            Log In
          </button>
          <Button onClick={() => onOpenAuth('signup')} className="shadow-xl shadow-teal-500/20 bg-slate-900 hover:bg-slate-800">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};
