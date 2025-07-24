'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useCMSAuthStore } from '@/store/useCMSAuthStore';
import { layoutUtils } from '@/lib/design-system';
import { 
  Eye, 
  EyeOff, 
  LogIn, 
  Sparkles, 
  Shield, 
  Lock, 
  ArrowRight,
  AlertCircle 
} from 'lucide-react';

// Enhanced login form with modern UI
interface LoginForm {
  password: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error, clearError } = useCMSAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attemptCount, setAttemptCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<LoginForm>();

  const password = watch('password');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    clearError();
    
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, [clearError]);

  const onSubmit = async (data: LoginForm) => {
    const success = await login(data.password);
    if (success) {
      router.push('/admin');
    } else {
      setAttemptCount(prev => prev + 1);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return 0;
    if (password === 'redux2025') return 100;
    if (password.includes('redux')) return 60;
    if (password.length >= 4) return 30;
    return 10;
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Modern Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 relative">
            <Sparkles className="w-10 h-10 text-white" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
            REDUX
          </h1>
          <p className="text-white/70 text-lg font-medium mb-2">Content Management System</p>
          <div className="flex items-center justify-center gap-2 text-sm text-white/50">
            <Lock className="w-4 h-4" />
            <span>Secure Admin Access</span>
          </div>
          
          {/* Live Time Display */}
          <div className="mt-4 text-xs text-white/40">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} • {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* Modern Login Card */}
        <div className="relative overflow-hidden bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
          
          <div className="relative z-10 p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Enhanced Password Field */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-white/90">
                    Administrator Password
                  </label>
                  {attemptCount > 0 && (
                    <span className="text-xs text-orange-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Attempt {attemptCount}
                    </span>
                  )}
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative">
                    <input
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 4,
                          message: 'Password must be at least 4 characters'
                        }
                      })}
                      type={showPassword ? 'text' : 'password'}
                      className={`w-full px-6 py-4 pr-12 bg-white/10 backdrop-blur-sm border rounded-2xl text-white placeholder-white/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 focus:bg-white/15 ${
                        errors.password ? 'border-red-400/50 focus:ring-red-400/50' : 'border-white/20'
                      }`}
                      placeholder="Enter your admin password"
                      autoComplete="current-password"
                    />
                    
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    
                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full transition-all duration-300"
                           style={{ width: `${getPasswordStrength()}%` }}>
                      </div>
                    )}
                  </div>
                </div>
                
                {errors.password && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.password.message}</span>
                  </div>
                )}
              </div>

              {/* Enhanced Error Message */}
              {error && (
                <div className="relative overflow-hidden bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-300">Authentication Failed</p>
                      <p className="text-sm text-red-400/80 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="group relative w-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center justify-center gap-3 px-6 py-4">
                  {isSubmitting || isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Access Admin Panel</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Development Hint */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-yellow-300 mb-1">Development Mode</p>
                    <p className="text-xs text-white/60">
                      Use the configured admin password to access the content management system
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Security Features Info */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-xs text-white/60">Secure Access</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-xs text-white/60">Encrypted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-xs text-white/40">
            © 2025 REDUX Fashion Collective. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Powered by Next.js • Secured with modern authentication
          </p>
        </div>
      </div>
      
      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .group:hover .w-20 {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}