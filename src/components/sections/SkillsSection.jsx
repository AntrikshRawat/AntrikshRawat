import React, { useRef, useEffect } from 'react';
import { skills } from '../../data/resumeData';


export default function SkillsSection() {
  const sectionRef = useRef();
  const titleRef = useRef();
  const gridRef = useRef();

  

  const categoryColors = {
    'Languages': 'var(--accent-cyan)',
    'Frontend': 'var(--accent-purple)',
    'Backend': 'var(--accent-magenta)',
    'Databases': '#00d4aa',
    'DevOps & Tools': '#ffaa00',
    'Core Concepts': '#ff5588',
  };

  return (
    <section ref={sectionRef} className="portfolio-section" id="skills-section">
      <div className="section-content">
        <div ref={titleRef} style={{ marginBottom: '1rem' }}>
          <h2 className="section-title">
            <span className="gradient-text">Technical Skills</span>
          </h2>
          <p className="section-subtitle">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        <div ref={gridRef} className="skills-grid">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="glass-card skill-card">
              <div className="skill-category" style={{ color: categoryColors[category] || 'var(--accent-cyan)' }}>
                {category}
              </div>
              <div className="skill-list">
                {items.map((skill) => (
                  <span key={skill} className="skill-item">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
