import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, KeyRound, Shield, Truck, Building2, Droplet, UserCheck } from 'lucide-react';
import { UserRole } from '../types';

interface AuthCardProps {
  onSuccessLogin?: (role: UserRole, email: string) => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({ onSuccessLogin }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup wizard state
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('supplier');
  const [signupOtp, setSignupOtp] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // Forgot password wizard state
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');

  // Password policy check
  const hasMinLength = signupPassword.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(signupPassword);
  const hasNumber = /[0-9]/.test(signupPassword);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg('Please enter both email/username and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Determine role from input or default
      const role: UserRole = loginEmail.includes('labour')
        ? 'labour'
        : loginEmail.includes('station')
        ? 'filling_station'
        : 'supplier';

      setSuccessMsg(`Welcome back! Authenticated as ${role.replace('_', ' ')}.`);
      if (onSuccessLogin) {
        onSuccessLogin(role, loginEmail);
      }
    }, 700);
  };

  const handleDemoSelect = (role: UserRole) => {
    setErrorMsg(null);
    if (role === 'supplier') {
      setLoginEmail('supplier@orionpixels.com');
      setLoginPassword('WaterSupply2026!');
    } else if (role === 'filling_station') {
      setLoginEmail('station_operator@wsms.local');
      setLoginPassword('DepotMaster2026!');
    } else {
      setLoginEmail('labour_driver@wsms.local');
      setLoginPassword('DriverFast2026!');
    }
  };

  const handleSendSignupCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!signupEmail || !signupEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSignupStep(2);
      setSuccessMsg(`Verification code sent to ${signupEmail}. Use code: 749210 (or any 6 digits).`);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (signupOtp.length !== 6) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSignupStep(3);
      setSuccessMsg('Email verified successfully! Now create your password.');
    }, 500);
  };

  const handleCompleteSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!isPasswordValid) {
      setErrorMsg('Password must be at least 8 characters and contain letters and numbers.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg('Account created successfully! Redirecting to dashboard...');
      setTimeout(() => {
        if (onSuccessLogin) {
          onSuccessLogin(signupRole, signupEmail);
        }
      }, 1000);
    }, 800);
  };

  const handleSendResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setErrorMsg('Please provide your registered account email.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotStep(2);
      setSuccessMsg(`Reset code sent to ${forgotEmail}. Check your inbox.`);
    }, 600);
  };

  const handleFinishReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (forgotOtp.length !== 6) {
      setErrorMsg('Enter the 6-digit reset code.');
      return;
    }
    if (forgotNewPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg('Password updated successfully! You may now sign in.');
      setTimeout(() => {
        setActiveTab('login');
        setForgotStep(1);
        setLoginEmail(forgotEmail);
        setLoginPassword('');
      }, 1000);
    }, 700);
  };

  return (
    <div
      className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-sky-950/20 border border-slate-100 p-6 sm:p-8 relative z-10 transition-all duration-300"
      id="auth-card"
      role="region"
      aria-label="Account Access & Authentication Portal"
    >
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white p-2 shadow-lg shadow-sky-600/15 border border-slate-100 mb-3">
          <img
            src="./assets/aistudio/wsms-icon_a21bed6f.png"
            alt="WSMS Mineral Water Supply Logo"
            className="w-full h-full object-contain"
            loading="eager"
            width="64"
            height="64"
          />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {activeTab === 'login'
            ? 'Welcome Back'
            : activeTab === 'signup'
            ? 'Get Started with WSMS'
            : 'Reset Password'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {activeTab === 'login'
            ? 'Sign in to access your water operations dashboard'
            : activeTab === 'signup'
            ? 'Set up supplier, station or driver account'
            : 'Enter your email to receive recovery instructions'}
        </p>
      </div>

      {/* Dynamic Accessible Status / Error Announcements */}
      <div aria-live="polite" className="sr-only">
        {errorMsg && `Error: ${errorMsg}`}
        {successMsg && `Success: ${successMsg}`}
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 text-xs sm:text-sm flex items-start gap-2 animate-in fade-in duration-200"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div
          role="status"
          className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg text-emerald-800 text-xs sm:text-sm flex items-start gap-2 animate-in fade-in duration-200"
        >
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs Switcher (when not in forgot flow) */}
      {activeTab !== 'forgot' && (
        <div
          className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6"
          role="tablist"
          aria-label="Authentication Options"
        >
          <button
            type="button"
            role="tab"
            id="tab-login"
            aria-selected={activeTab === 'login'}
            aria-controls="panel-login"
            tabIndex={activeTab === 'login' ? 0 : -1}
            onClick={() => {
              setActiveTab('login');
              setErrorMsg(null);
            }}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0077cc] ${
              activeTab === 'login'
                ? 'bg-white text-[#0077cc] shadow-sm shadow-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            role="tab"
            id="tab-signup"
            aria-selected={activeTab === 'signup'}
            aria-controls="panel-signup"
            tabIndex={activeTab === 'signup' ? 0 : -1}
            onClick={() => {
              setActiveTab('signup');
              setErrorMsg(null);
            }}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0077cc] ${
              activeTab === 'signup'
                ? 'bg-white text-[#0077cc] shadow-sm shadow-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>
      )}

      {/* -------------------- LOGIN FORM -------------------- */}
      {activeTab === 'login' && (
        <form
          id="panel-login"
          role="tabpanel"
          aria-labelledby="tab-login"
          onSubmit={handleLoginSubmit}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Email or Username
            </label>
            <input
              id="login-email"
              type="text"
              required
              autoComplete="username"
              placeholder="e.g. supplier@orionpixels.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:border-[#0077cc] focus:ring-2 focus:ring-[#0077cc]/20 transition-all outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('forgot');
                  setErrorMsg(null);
                }}
                className="text-xs text-[#0077cc] hover:text-[#005fa3] hover:underline font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0077cc]"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:border-[#0077cc] focus:ring-2 focus:ring-[#0077cc]/20 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Eye className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 rounded-[8px] font-semibold text-white bg-[#0077cc] hover:bg-[#005fa3] shadow-xs active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0077cc]"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
          </button>

          {/* Quick Demo Credentials matching dashboard palette */}
          <div className="pt-3 border-t border-[#eef2f7]">
            <span className="block text-[11px] font-bold text-[#666666] uppercase tracking-wider mb-2 text-center">
              One-Click Demo Profiles
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleDemoSelect('supplier')}
                className="p-2 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 rounded-[8px] text-center text-[11px] font-bold text-[#0077cc] transition-all cursor-pointer flex flex-col items-center gap-0.5"
                title="Fill Supplier credentials"
              >
                <Droplet className="w-3.5 h-3.5 text-[#0077cc]" />
                <span>Supplier</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSelect('filling_station')}
                className="p-2 bg-purple-50/70 hover:bg-purple-100/70 border border-purple-200 rounded-[8px] text-center text-[11px] font-bold text-[#7d5fe6] transition-all cursor-pointer flex flex-col items-center gap-0.5"
                title="Fill Station credentials"
              >
                <Building2 className="w-3.5 h-3.5 text-[#7d5fe6]" />
                <span>Station</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSelect('labour')}
                className="p-2 bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 rounded-[8px] text-center text-[11px] font-bold text-[#33c47a] transition-all cursor-pointer flex flex-col items-center gap-0.5"
                title="Fill Labour / Driver credentials"
              >
                <Truck className="w-3.5 h-3.5 text-[#33c47a]" />
                <span>Labour</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* -------------------- SIGNUP WIZARD -------------------- */}
      {activeTab === 'signup' && (
        <div id="panel-signup" role="tabpanel" aria-labelledby="tab-signup">
          {/* Step Progress Dots */}
          <div className="flex items-center justify-between mb-5 px-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    signupStep === step
                      ? 'bg-[#0077cc] text-white ring-4 ring-sky-100'
                      : signupStep > step
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {signupStep > step ? '✓' : step}
                </span>
                <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                  {step === 1 ? 'Role' : step === 2 ? 'Verify' : 'Password'}
                </span>
                {step < 3 && <div className="w-6 sm:w-10 h-0.5 bg-slate-200" />}
              </div>
            ))}
          </div>

          {/* Step 1: Email + Role */}
          {signupStep === 1 && (
            <form onSubmit={handleSendSignupCode} className="space-y-4">
              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Work Email Address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-[#0077cc] focus:ring-2 focus:ring-[#0077cc]/20 transition-all outline-none"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Your Operational Role
                </span>
                <div
                  className="grid grid-cols-3 gap-2"
                  role="radiogroup"
                  aria-label="Operational Role"
                >
                  <label
                    className={`flex flex-col items-center text-center p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                      signupRole === 'supplier'
                        ? 'border-[#0077cc] bg-sky-50/50 text-[#0077cc]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="supplier"
                      checked={signupRole === 'supplier'}
                      onChange={() => setSignupRole('supplier')}
                      className="sr-only"
                    />
                    <Droplet className="w-5 h-5 mb-1 text-[#0077cc]" />
                    <span className="text-xs font-semibold">Supplier</span>
                    <span className="text-[10px] text-slate-400">Inventory</span>
                  </label>

                  <label
                    className={`flex flex-col items-center text-center p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                      signupRole === 'filling_station'
                        ? 'border-[#0077cc] bg-sky-50/50 text-[#0077cc]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="filling_station"
                      checked={signupRole === 'filling_station'}
                      onChange={() => setSignupRole('filling_station')}
                      className="sr-only"
                    />
                    <Building2 className="w-5 h-5 mb-1 text-indigo-600" />
                    <span className="text-xs font-semibold">Station</span>
                    <span className="text-[10px] text-slate-400">Filtration</span>
                  </label>

                  <label
                    className={`flex flex-col items-center text-center p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                      signupRole === 'labour'
                        ? 'border-[#0077cc] bg-sky-50/50 text-[#0077cc]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="labour"
                      checked={signupRole === 'labour'}
                      onChange={() => setSignupRole('labour')}
                      className="sr-only"
                    />
                    <Truck className="w-5 h-5 mb-1 text-emerald-600" />
                    <span className="text-xs font-semibold">Labour</span>
                    <span className="text-[10px] text-slate-400">Delivery</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#0077cc] to-[#00a8ff] shadow-md shadow-sky-600/30 hover:shadow-sky-600/50 cursor-pointer text-sm"
              >
                {isLoading ? 'Sending verification...' : 'Send Verification Code'}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {signupStep === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <span className="text-xs text-slate-500">Code dispatched to:</span>
                <p className="text-sm font-semibold text-slate-800 break-all">{signupEmail}</p>
              </div>

              <div>
                <label
                  htmlFor="signup-otp"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Enter 6-Digit OTP Code
                </label>
                <input
                  id="signup-otp"
                  type="text"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                  placeholder="123456"
                  value={signupOtp}
                  onChange={(e) => setSignupOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#0077cc] focus:ring-2 focus:ring-[#0077cc]/20 transition-all outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#0077cc] to-[#00a8ff] shadow-md shadow-sky-600/30 cursor-pointer text-sm"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>

              <button
                type="button"
                onClick={() => setSignupStep(1)}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 font-medium cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back / Change Email</span>
              </button>
            </form>
          )}

          {/* Step 3: Password Creation */}
          {signupStep === 3 && (
            <form onSubmit={handleCompleteSignup} className="space-y-4">
              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Create Secure Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  required
                  placeholder="Min 8 chars, letters & numbers"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-[#0077cc] outline-none"
                />

                {/* Live Password Requirements checklist */}
                <div className="mt-2 space-y-1 text-[11px]">
                  <div
                    className={`flex items-center gap-1.5 ${
                      hasMinLength ? 'text-emerald-600 font-medium' : 'text-slate-400'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[10px]">
                      {hasMinLength ? '✓' : '•'}
                    </span>
                    <span>At least 8 characters</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      hasLetter && hasNumber ? 'text-emerald-600 font-medium' : 'text-slate-400'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[10px]">
                      {hasLetter && hasNumber ? '✓' : '•'}
                    </span>
                    <span>Contains both letters and numbers</span>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-confirm-password"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Confirm Password
                </label>
                <input
                  id="signup-confirm-password"
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-[#0077cc] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md shadow-emerald-600/30 cursor-pointer text-sm"
              >
                {isLoading ? 'Creating Account...' : 'Complete & Launch Dashboard'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* -------------------- FORGOT PASSWORD FLOW -------------------- */}
      {activeTab === 'forgot' && (
        <div className="space-y-4">
          {forgotStep === 1 ? (
            <form onSubmit={handleSendResetCode} className="space-y-4">
              <div>
                <label
                  htmlFor="forgot-email"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Registered Account Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-[#0077cc] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#0077cc] to-[#00a8ff] shadow-md shadow-sky-600/30 cursor-pointer text-sm"
              >
                {isLoading ? 'Processing...' : 'Send Recovery Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleFinishReset} className="space-y-4">
              <div>
                <label
                  htmlFor="forgot-otp"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  6-Digit Recovery Code
                </label>
                <input
                  id="forgot-otp"
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value)}
                  className="w-full text-center font-mono text-lg py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#0077cc] outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="forgot-new-pass"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  New Password
                </label>
                <input
                  id="forgot-new-pass"
                  type="password"
                  required
                  placeholder="Enter new password (min 8 chars)"
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-[#0077cc] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#0077cc] to-[#00a8ff] shadow-md shadow-sky-600/30 cursor-pointer text-sm"
              >
                {isLoading ? 'Updating...' : 'Update Password & Return to Login'}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMsg(null);
            }}
            className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </button>
        </div>
      )}

      {/* Security & WCAG Assurance Note */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <Shield className="w-3.5 h-3.5 text-sky-600 shrink-0" aria-hidden="true" />
        <span>256-bit SSL Encrypted · Sindh Water Distribution Compliant</span>
      </div>
    </div>
  );
};
