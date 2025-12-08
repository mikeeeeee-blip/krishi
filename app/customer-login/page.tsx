'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { User, Mail, Lock, Phone, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';

export default function CustomerLoginPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Login functionality coming soon!');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Registration functionality coming soon!');
  };

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-white">
      <TopBar />
      <Header onMenuToggle={toggleMobileMenu} isMenuOpen={isMobileMenuOpen} />
      <Navigation isMobileMenuOpen={isMobileMenuOpen} onCloseMobileMenu={closeMobileMenu} />
      
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-banner-content">
          <h1>Customer Login</h1>
          <p>Access Your Account or Create a New One</p>
        </div>
      </div>

      <div className="page-content">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span className="breadcrumbs-separator">/</span>
          <span>Login</span>
        </div>

        <div className="max-w-md mx-auto">
          {/* Tab Switcher */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 rounded-md font-semibold transition-colors ${
                activeTab === 'login'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 rounded-md font-semibold transition-colors ${
                activeTab === 'register'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Register
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Welcome Back!</h2>
                <p className="text-gray-600 text-sm">Login to your account to continue</p>
              </div>

              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label htmlFor="login-email" className="form-label">Email or Phone</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="login-email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="form-input pl-10"
                      placeholder="Enter email or phone"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="login-password" className="form-label">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="form-input pl-10 pr-10"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-green-600 hover:underline">Forgot password?</a>
                </div>

                <button type="submit" className="form-button w-full flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Login
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Don&apos;t have an account?{' '}
                  <button onClick={() => setActiveTab('register')} className="text-green-600 font-semibold hover:underline">
                    Register Now
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Create Account</h2>
                <p className="text-gray-600 text-sm">Join ECLAT AGROXGLOBAL and start shopping</p>
              </div>

              <form onSubmit={handleRegisterSubmit}>
                <div className="form-group">
                  <label htmlFor="register-name" className="form-label">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="register-name"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      className="form-input pl-10"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-email" className="form-label">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="register-email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="form-input pl-10"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-phone" className="form-label">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="register-phone"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      className="form-input pl-10"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-password" className="form-label">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="register-password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="form-input pl-10"
                      placeholder="Create password"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-confirm-password" className="form-label">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="register-confirm-password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      className="form-input pl-10"
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="flex items-start gap-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500 mt-1" required />
                    <span className="text-gray-600">
                      I agree to the <Link href="/terms-of-use" className="text-green-600 hover:underline">Terms of Use</Link> and <Link href="/privacy-policy" className="text-green-600 hover:underline">Privacy Policy</Link>
                    </span>
                  </label>
                </div>

                <button type="submit" className="form-button w-full flex items-center justify-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{' '}
                  <button onClick={() => setActiveTab('login')} className="text-green-600 font-semibold hover:underline">
                    Login
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="mt-8 info-box">
            <h3 className="font-semibold text-gray-900 mb-3">Benefits of Creating an Account</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Track your orders in real-time</li>
              <li>• Save multiple shipping addresses</li>
              <li>• Quick checkout with saved details</li>
              <li>• Access exclusive offers and discounts</li>
              <li>• Earn rewards with referral program</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
