
import React, { useState, useContext, useEffect } from 'react';
import { StoreContext } from '../store';
import { X, Mail, Lock, User, Loader2, AlertCircle, Building2, CheckCircle, Copy, Home, MapPin, Plus, XCircle } from 'lucide-react';
import { Button } from './Button';
import { supabase } from '../supabaseClient';
import { UserRole } from '../types';

const PENDING_CHANGELOG_LINK_KEY = 'pendingChangelogLink';
const PENDING_VENDOR_COVERAGE_KEY = 'pendingVendorCoverageAreas';
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const store = useContext(StoreContext);
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(defaultMode);
  
  // Signup Sub-mode: Initialize as null so nothing is pre-selected
  const [signupMode, setSignupMode] = useState<'browse' | 'create' | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCompanyCode, setCreatedCompanyCode] = useState<string | null>(null);
  const [requiresEmailConfirmation, setRequiresEmailConfirmation] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [vendorCoverageInput, setVendorCoverageInput] = useState('');
  const [vendorCoverageAreas, setVendorCoverageAreas] = useState<string[]>([]);

  // Sync mode with defaultMode when modal opens or prop changes
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setSignupMode(null); // Reset sub-mode
      setError(null); // Clear errors
      setCreatedCompanyCode(null);
      setRequiresEmailConfirmation(false);
      setVerificationEmail(null);
      setResetSent(false);
      setVendorCoverageInput('');
      setVendorCoverageAreas([]);
    }
  }, [isOpen, defaultMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!store) throw new Error("App state not initialized");

      if (mode === 'reset') {
        if (!formData.email) throw new Error("Email is required");
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/#/login`
        });
        if (resetError) throw resetError;
        setResetSent(true);
        return;
      }

      if (mode === 'login') {
        const { error } = await store.login(formData.email, formData.password);
        if (error) throw error;
        const pendingLink = localStorage.getItem(PENDING_CHANGELOG_LINK_KEY);
        if (pendingLink) {
          localStorage.removeItem(PENDING_CHANGELOG_LINK_KEY);
          const targetUrl = `${window.location.origin}/#${pendingLink}`;
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
        const isClient = store.currentUser?.role === UserRole.CLIENT;
        window.location.hash = isClient ? '#/client-dashboard' : '#/';
        onClose();
      } else {
        if (!formData.fullName) throw new Error("Full Name is required");
        
        // Validation: Ensure user has selected a mode
        if (!signupMode) {
            throw new Error("Please select whether you are starting as a Homeowner or a New Vendor.");
        }

        if (signupMode === 'create') {
          localStorage.setItem(PENDING_VENDOR_COVERAGE_KEY, JSON.stringify(vendorCoverageAreas));
        } else {
          localStorage.removeItem(PENDING_VENDOR_COVERAGE_KEY);
        }
        
        const res = await store.signup(
            formData.email, 
            formData.password, 
            formData.fullName, 
            signupMode
        );
        
        if (res.error) throw res.error;
        if (res.requiresEmailConfirmation) {
            setRequiresEmailConfirmation(true);
            setVerificationEmail(formData.email);
            return;
        }

        // If a new company was created, show the code
        if (res.companyCode) {
            setCreatedCompanyCode(res.companyCode);
            // DO NOT close modal, show success screen
        } else {
            if (signupMode === 'browse') {
              window.location.hash = '#/client-dashboard';
            } else {
              window.location.hash = '#/';
            }
            onClose();
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
      if (createdCompanyCode) {
          navigator.clipboard.writeText(createdCompanyCode);
          // Optional: could show copied toast
      }
  };

  const handleFinish = () => {
      onClose();
      setCreatedCompanyCode(null);
  };

  const handleAddCoverageArea = () => {
    const normalized = vendorCoverageInput.trim();
    if (!normalized) return;
    if (vendorCoverageAreas.includes(normalized)) {
      setVendorCoverageInput('');
      return;
    }
    setVendorCoverageAreas((prev) => [...prev, normalized]);
    setVendorCoverageInput('');
  };

  const handleRemoveCoverageArea = (area: string) => {
    setVendorCoverageAreas((prev) => prev.filter((item) => item !== area));
  };

  // --- SUCCESS VIEW (NEW COMPANY) ---
  if (createdCompanyCode) {
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Company Created!</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                    Your account is ready. Share this invite code with your team members so they can join your company.
                </p>

                <div className="bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6 flex flex-col items-center justify-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Company Invite Code</span>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-mono font-bold text-slate-900 dark:text-white tracking-widest">{createdCompanyCode}</span>
                        <button onClick={handleCopyCode} className="text-slate-400 hover:text-emerald-500 transition-colors" title="Copy">
                            <Copy className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <Button onClick={handleFinish} className="w-full h-12 text-lg">
                    Go to Dashboard
                </Button>
            </div>
        </div>
      );
  }

  if (requiresEmailConfirmation) {
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verify your email</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                    We sent a verification link to {verificationEmail || 'your email'}. Please confirm to activate your account.
                </p>
                <Button onClick={handleFinish} className="w-full h-12 text-lg">
                    Close
                </Button>
            </div>
        </div>
      );
  }

  // --- STANDARD FORM VIEW ---
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="h-11 flex items-center justify-center mb-4">
              <img src="/branding/logo/sbre-logo.svg" alt="SBRE platform logo" className="h-full w-auto object-contain dark:hidden" />
              <img src="/branding/logo/sbre-logo-light.svg" alt="SBRE platform logo" className="h-full w-auto object-contain hidden dark:block" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {mode === 'login' ? 'Welcome Back' : mode === 'reset' ? 'Reset Password' : 'Create Account'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              {mode === 'login'
                ? 'Enter your credentials to access your account'
                : mode === 'reset'
                ? 'We will email you a password reset link'
                : 'Manage your field service business'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* SIGNUP TYPE SELECTION */}
            {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                        type="button"
                        onClick={() => setSignupMode('browse')}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${signupMode === 'browse' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                    >
                        <Home className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase text-center">Homeowner</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setSignupMode('create')}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${signupMode === 'create' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                    >
                        <Building2 className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase">New Vendor</span>
                    </button>
                </div>
            )}

            {mode === 'signup' && (
              <p className="text-[11px] text-slate-500 mb-2 text-center">
                {signupMode === 'browse'
                  ? 'Homeowner: search and compare vendors.'
                  : signupMode === 'create'
                  ? 'New Vendor: create a provider account to receive leads.'
                  : 'Select an option to continue.'}
              </p>
            )}

            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="password" 
                    required
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && signupMode === 'create' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Coverage Areas</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={vendorCoverageInput}
                      onChange={e => setVendorCoverageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          handleAddCoverageArea();
                        }
                      }}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
                      placeholder="City, ZIP, or region"
                    />
                  </div>
                  <Button type="button" variant="outline" onClick={handleAddCoverageArea}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {vendorCoverageAreas.length === 0 ? (
                    <p className="text-[11px] text-slate-500">Optional now. You can update this in Settings later.</p>
                  ) : (
                    vendorCoverageAreas.map((area) => (
                      <span key={area} className="inline-flex items-center gap-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 text-[11px] font-semibold">
                        {area}
                        <button type="button" onClick={() => handleRemoveCoverageArea(area)} className="text-teal-600 hover:text-teal-800">
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}


            <Button 
              type="submit" 
              className="w-full h-11 text-base shadow-lg shadow-teal-500/20 mt-4" 
              disabled={isLoading || (mode === 'signup' && !signupMode)}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : mode === 'login' ? (
                'Log In'
              ) : mode === 'reset' ? (
                'Send Reset Email'
              ) : signupMode === 'browse' ? (
                'Create Account'
              ) : signupMode === 'create' ? (
                'New Vendor'
              ) : (
                'Sign Up'
              )}
            </Button>
            {mode === 'signup' && signupMode === 'create' && (
              <button
                type="button"
                onClick={() => {
                  window.location.hash = '#/';
                  onClose();
                }}
                className="w-full mt-2 h-11 text-base font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            )}
            {mode === 'reset' && resetSent && (
              <p className="text-xs text-emerald-600 text-center mt-3">
                Reset email sent. Please check your inbox.
              </p>
            )}
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            {mode === 'login' ? (
              <>
                <button onClick={() => setMode('reset')} className="font-bold text-teal-600 hover:underline">
                  Forgot password?
                </button>
                <span className="mx-2">•</span>
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="font-bold text-teal-600 hover:underline">
                  Sign up
                </button>
              </>
            ) : mode === 'reset' ? (
              <>
                Remembered your password?{' '}
                <button onClick={() => setMode('login')} className="font-bold text-teal-600 hover:underline">
                  Log in
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="font-bold text-teal-600 hover:underline">
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
