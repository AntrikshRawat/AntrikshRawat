import React, { useRef } from 'react';
import { experience } from '../../data/resumeData';
import CardCarousel from '../CardCarousel';

export default function ExperienceSection() {
  const sectionRef = useRef();

  return (
    <section ref={sectionRef} className="portfolio-section" id="experience-section">
      <div className="section-content">
        <div style={{ marginBottom: '1rem' }}>
          <h2 className="section-title">
            <span className="gradient-text-cyan">Experience</span>
          </h2>
          <p className="section-subtitle">
            My professional journey so far
          </p>
        </div>

        <CardCarousel>
          {experience.map((exp, i) => (
            <div key={i} className="glass-card experience-card">
              <div className="exp-header">
                <h3 className="exp-company">{exp.company}</h3>
                <span className="exp-date">{exp.duration}</span>
              </div>
              <div className="exp-role">
                {exp.role} • {exp.type}
              </div>
              <ul className="exp-bullets">
                {exp.bullets.map((bullet, j) => (
                  <li key={j}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardCarousel>
      </div>
    </section>
  );
}
