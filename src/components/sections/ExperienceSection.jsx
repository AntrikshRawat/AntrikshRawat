import React, { useRef, useEffect } from 'react';
import { experience } from '../../data/resumeData';


export default function ExperienceSection() {
  const sectionRef = useRef();
  const titleRef = useRef();
  const timelineRef = useRef();

  

  return (
    <section ref={sectionRef} className="portfolio-section" id="experience-section">
      <div className="section-content">
        <div ref={titleRef} style={{ marginBottom: '1rem' }}>
          <h2 className="section-title">
            <span className="gradient-text-cyan">Experience</span>
          </h2>
          <p className="section-subtitle">
            My professional journey so far
          </p>
        </div>

        <div ref={timelineRef} className="timeline">
          {experience.map((exp, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot" />
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div className="timeline-header">
                  <h3 className="timeline-company">{exp.company}</h3>
                  <span className="timeline-date">{exp.duration}</span>
                </div>
                <div className="timeline-role">
                  {exp.role} • {exp.type}
                </div>
                <ul className="timeline-bullets">
                  {exp.bullets.map((bullet, j) => (
                    <li key={j}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
