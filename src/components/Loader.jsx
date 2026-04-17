import React, { useEffect, useState, useRef } from 'react';

export default function Loader({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const called = useRef(false);

  // Simulated progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.max(0.5, (100 - prev) * 0.06);
        return Math.min(prev + increment, 100);
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Trigger onLoaded when progress reaches 100
  useEffect(() => {
    if (progress >= 100 && !called.current) {
      called.current = true;
      const timer = setTimeout(() => {
        onLoaded?.();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, onLoaded]);

  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="loader-screen" id="loader-screen">
      <div className="loader-ring">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f5ff" />
              <stop offset="50%" stopColor="#b44aff" />
              <stop offset="100%" stopColor="#ff006e" />
            </linearGradient>
          </defs>
          <circle className="bg-ring" cx="60" cy="60" r="52" />
          <circle
            className="progress-ring"
            cx="60"
            cy="60"
            r="52"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="loader-percentage">
          {Math.round(progress)}%
        </div>
      </div>
      <div className="loader-name">Antriksh Rawat</div>
      <div className="loader-subtitle">Loading Portfolio...</div>
    </div>
  );
}
