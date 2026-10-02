import React, { useRef } from 'react';
import { projects } from '../../data/resumeData';
import CardCarousel from '../CardCarousel';

export default function ProjectsSection() {
  const sectionRef = useRef();

  return (
    <section ref={sectionRef} className="portfolio-section" id="projects-section">
      <div className="section-content">
        <div style={{ marginBottom: '1rem' }}>
          <h2 className="section-title">
            <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle">
            Featured work showcasing full-stack development, Web3, and AI integration
          </p>
        </div>

        <CardCarousel>
          {projects.map((project) => (
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
              
              {(project.githubLink || project.previewLink) && (
                <div className="project-actions">
                  {project.previewLink && (
                    <a href={project.previewLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ '--btn-color': project.color }}>
                      Preview
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                  )}
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                      GitHub
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardCarousel>
      </div>
    </section>
  );
}
