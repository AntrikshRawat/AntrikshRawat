import React, { useState, useCallback, useEffect, useRef } from 'react';

export default function CardCarousel({ children }) {
  const [current, setCurrent] = useState(0);
  const items = React.Children.toArray(children);
  const total = items.length;

  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef(null);

  const prev = useCallback(() => {
    setCurrent((c) => (c > 0 ? c - 1 : total - 1));
  }, [total]);

  const next = useCallback(() => {
    setCurrent((c) => (c < total - 1 ? c + 1 : 0));
  }, [total]);

  const handleInteraction = useCallback((action) => {
    action();
    setIsPaused(true);
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  }, []);

  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c < total - 1 ? c + 1 : 0));
    }, 2000);
    return () => clearInterval(timer);
  }, [isPaused, total]);

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  if (total === 0) return null;

  return (
    <div className="carousel">
      <div className="carousel-viewport">
        <div
          className="carousel-track"
          style={{ 
            transform: `translateX(-${(current * 100) / total}%)`,
            width: `${total * 100}%` 
          }}
        >
          {items.map((child, i) => (
            <div className="carousel-slide" key={i} style={{ width: `${100 / total}%` }}>
              {child}
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-nav">
        <button className="carousel-arrow" onClick={() => handleInteraction(prev)} aria-label="Previous card">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="carousel-dots">
          {items.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === current ? 'active' : ''}`}
              onClick={() => handleInteraction(() => setCurrent(i))}
              aria-label={`Go to card ${i + 1}`}
            />
          ))}
        </div>

        <button className="carousel-arrow" onClick={() => handleInteraction(next)} aria-label="Next card">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
