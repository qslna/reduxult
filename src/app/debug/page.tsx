'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const envVars = {
    'NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT': process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'NOT SET',
    'NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY': process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || 'NOT SET',
    'NODE_ENV': process.env.NODE_ENV || 'NOT SET',
  };

  const checkImageKit = () => {
    try {
      // Check if ImageKit config is accessible
      const config = {
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
      };
      return {
        status: config.publicKey && config.urlEndpoint ? 'OK' : 'ERROR',
        config: config
      };
    } catch (e) {
      return {
        status: 'ERROR',
        error: e instanceof Error ? e.message : 'Unknown error'
      };
    }
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Debug Information</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <div className="bg-gray-900 p-4 rounded">
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key} className="mb-2">
              <span className="text-blue-400">{key}:</span>{' '}
              <span className={value === 'NOT SET' ? 'text-red-400' : 'text-green-400'}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">ImageKit Configuration</h2>
        <div className="bg-gray-900 p-4 rounded">
          <pre>{JSON.stringify(checkImageKit(), null, 2)}</pre>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Runtime Information</h2>
        <div className="bg-gray-900 p-4 rounded">
          <div>Browser: {typeof window !== 'undefined' ? 'Client-side' : 'Server-side'}</div>
          <div>URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
        </div>
      </section>

      <a href="/" className="text-blue-400 hover:underline">
        Back to Home
      </a>
    </div>
  );
}