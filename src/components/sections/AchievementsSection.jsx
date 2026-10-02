import React, { useRef, useEffect, useState } from 'react';
import { achievements } from '../../data/resumeData';
import CardCarousel from '../CardCarousel';

function CountUp({ target, duration = 2 }) {
  const [count, setCount] = useState(0);
  const triggered = useRef(false);

  useEffect(() => {
    // Simple count up effect on mount
    if (triggered.current) return;
    triggered.current = true;
    
    let start = 0;
    const increment = target / (duration * 60);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}+</span>;
}

export default function AchievementsSection() {
  const sectionRef = useRef();

  return (
    <section ref={sectionRef} className="portfolio-section" id="achievements-section">
      <div className="section-content">
        <div style={{ marginBottom: '1rem' }}>
          <h2 className="section-title">
            <span className="gradient-text-cyan">Achievements</span>
          </h2>
          <p className="section-subtitle">
            Hackathons, competitions, and milestones
          </p>
        </div>

        <CardCarousel>
          {achievements.map((ach, i) => (
            <div key={i} className="glass-card achievement-card">
              <span className="achievement-icon">{ach.icon}</span>
              {ach.count ? (
                <div className="achievement-count">
                  <CountUp target={ach.count} />
                </div>
              ) : null}
              <h3 className="achievement-title">{ach.title}</h3>
              <div className="achievement-subtitle">{ach.subtitle}</div>
              <p className="achievement-desc">{ach.description}</p>
            </div>
          ))}
        </CardCarousel>
      </div>
    </section>
  );
}
