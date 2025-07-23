'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Eye, 
  EyeOff, 
  Lock, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Timer,
  User
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface ModernLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModernLoginModal: React.FC<ModernLoginModalProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedTip, setSelectedTip] = useState(0);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    attemptLogin, 
    isLoggingIn, 
    loginError, 
    loginAttempts,
    isLockedOut,
    lockoutRemaining,
    resetLockout
  } = useAdminAuth();

  // Auto-focus password input when modal opens
  useEffect(() => {
    if (isOpen && passwordInputRef.current) {
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setShowPassword(false);
    }
  }, [isOpen]);

  // Cycle through tips
  const tips = [
    { icon: '🔐', text: 'Admin access allows you to manage all gallery content' },
    { icon: '📱', text: 'Your session will remain active for 24 hours' },
    { icon: '🎨', text: 'Use the Instagram-style interface to upload media' },
    { icon: '⚡', text: 'Drag and drop files for quick uploads' }
  ];

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setSelectedTip((prev) => (prev + 1) % tips.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, tips.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || isLoggingIn || isLockedOut) return;

    const success = await attemptLogin({ password, remember: rememberMe });
    if (success) {
      setPassword('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-6 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 rounded-full">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Admin Access</h2>
                <p className="text-purple-100 text-sm">REDUX Content Management</p>
              </div>
            </div>

            {/* Animated tip */}
            <motion.div
              key={selectedTip}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white/10 rounded-lg p-3 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{tips[selectedTip].icon}</span>
                <span className="text-sm">{tips[selectedTip].text}</span>
              </div>
            </motion.div>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Lockout Warning */}
            <AnimatePresence>
              {isLockedOut && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Timer className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Account Temporarily Locked</p>
                      <p className="text-xs text-red-600">
                        Try again in {lockoutRemaining} minute{lockoutRemaining !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Admin Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    disabled={isLoggingIn || isLockedOut}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoggingIn || isLockedOut}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoggingIn || isLockedOut}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Keep me signed in for 7 days
                </label>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {loginError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{loginError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Attempts Warning */}
              {loginAttempts > 0 && !isLockedOut && (
                <div className="flex items-center gap-2 p-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {3 - loginAttempts} attempt{3 - loginAttempts !== 1 ? 's' : ''} remaining
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!password.trim() || isLoggingIn || isLockedOut}
                className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
              >
                <AnimatePresence mode="wait">
                  {isLoggingIn ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Access Admin Panel</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Need admin access?</p>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>Admin: redux2025</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Editor: redux_editor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModernLoginModal;