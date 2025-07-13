'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-gray-400 mb-6">
          An error occurred while loading this page.
        </p>
        <div className="space-y-4">
          <button
            onClick={reset}
            className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition-colors"
          >
            Try again
          </button>
          <div>
            <a
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Return to home
            </a>
          </div>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-red-400">
              Error details (development only)
            </summary>
            <pre className="mt-2 text-xs bg-gray-900 p-4 rounded overflow-auto">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}