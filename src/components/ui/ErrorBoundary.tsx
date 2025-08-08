'use client';

import React, { Component, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-black text-white flex items-center justify-center px-4"
          >
            <div className="max-w-md w-full text-center">
              {/* Error Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="mb-8"
              >
                <div className="w-20 h-20 mx-auto border-2 border-red-500 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-8 h-8 text-red-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
              </motion.div>

              {/* Error Message */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <h1 className="text-2xl font-light mb-4 font-['Playfair_Display']">
                  오류가 발생했습니다
                </h1>
                <p className="text-gray-400 text-sm mb-2">
                  페이지를 로드하는 중에 예상치 못한 오류가 발생했습니다.
                </p>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-4 text-left bg-gray-900 p-4 rounded text-xs">
                    <summary className="cursor-pointer text-red-400 mb-2">
                      개발자 정보 (개발 모드에서만 표시)
                    </summary>
                    <pre className="whitespace-pre-wrap text-gray-300">
                      {this.state.error.message}
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <button
                  onClick={this.handleReload}
                  className="w-full bg-white text-black py-3 px-6 rounded-none hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  페이지 새로고침
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="w-full border border-white text-white py-3 px-6 rounded-none hover:bg-white hover:text-black transition-colors duration-200 font-medium"
                >
                  홈으로 돌아가기
                </button>
              </motion.div>

              {/* REDUX Branding */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1 }}
                className="mt-12"
              >
                <p className="text-xs text-gray-600 tracking-widest uppercase">
                  REDUX - Fashion Designer Collective
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      );
    }

    return this.props.children;
  }
}

// Functional Error Fallback Component
export function ErrorFallback({ 
  error, 
  resetErrorBoundary 
}: { 
  error: Error; 
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto border-2 border-red-500 rounded-full flex items-center justify-center mb-6">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-light mb-4">문제가 발생했습니다</h2>
        <p className="text-gray-400 text-sm mb-6">
          {error.message || '알 수 없는 오류가 발생했습니다.'}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="bg-white text-black py-2 px-6 rounded-none hover:bg-gray-200 transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}