import React, { useRef, useEffect } from 'react';
import { projects } from '../../data/resumeData';


export default function ProjectsSection() {
  const sectionRef = useRef();
  const titleRef = useRef();
  const gridRef = useRef();

  

  const badgeColors = ['', 'purple', 'magenta'];

  return (
    <section ref={sectionRef} className="portfolio-section" id="projects-section">
      <div className="section-content">
        <div ref={titleRef} style={{ marginBottom: '1rem' }}>
          <h2 className="section-title">
            <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle">
            Featured work showcasing full-stack development, Web3, and AI integration
          </p>
        </div>

        <div ref={gridRef} className="projects-grid">
          {projects.map((project, i) => (
            <div
              key={project.title}
              className="glass-card project-card"
              style={{ '--card-accent': project.color }}
            >
              <h3 className="project-title" style={{ color: project.color }}>
                {project.title}
              </h3>
              {project.event && (
                <div className="project-event">{project.event}</div>
              )}
              <div className="project-tech">
                {project.tech.map((t, j) => (
                  <span key={t} className={`tech-badge ${j % 3 === 1 ? 'purple' : j % 3 === 2 ? 'magenta' : ''}`}>
                    {t}
                  </span>
                ))}
              </div>
              <ul className="project-bullets">
                {project.bullets.map((bullet, j) => (
                  <li key={j}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
