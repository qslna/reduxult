'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays fallback UI
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state to show fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4 opacity-50">⚠️</div>
              <h1 className="text-2xl font-light tracking-wider mb-4">
                REDUX
              </h1>
              <h2 className="text-lg font-light tracking-wide text-gray-400 mb-6">
                Something went wrong
              </h2>
            </div>
            
            <div className="text-sm text-gray-500 mb-8">
              <p className="mb-2">
                We're sorry, but something unexpected happened.
              </p>
              <p>
                Please try refreshing the page or go back to home.
              </p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition-colors duration-300 text-sm tracking-wide"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition-colors duration-300 text-sm tracking-wide"
              >
                Go Home
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-red-400 text-sm mb-2">
                  Error Details (Development)
                </summary>
                <div className="bg-red-900/20 border border-red-800/30 rounded-md p-4 text-xs">
                  <pre className="whitespace-pre-wrap overflow-auto max-h-40">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * React Hook Error Boundary for functional components
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

/**
 * Simple Error Fallback Component
 */
export function SimpleErrorFallback({ 
  error, 
  resetError 
}: { 
  error?: Error; 
  resetError?: () => void; 
}) {
  return (
    <div className="min-h-[50vh] bg-black text-white flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="text-4xl mb-4 opacity-50">⚠️</div>
        <h3 className="text-lg font-light tracking-wide mb-4">
          Page Error
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          This page encountered an error. Try refreshing or going back.
        </p>
        <div className="flex gap-3 justify-center">
          {resetError && (
            <button
              onClick={resetError}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition-colors text-sm"
            >
              Try Again
            </button>
          )}
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition-colors text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;