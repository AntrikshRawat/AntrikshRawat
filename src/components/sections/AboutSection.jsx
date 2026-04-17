import React, { useRef, useEffect } from 'react';
import { education, personalInfo } from '../../data/resumeData';


export default function AboutSection() {
  const sectionRef = useRef();
  const titleRef = useRef();
  const bioRef = useRef();
  const cardRef = useRef();

  

  return (
    <section ref={sectionRef} className="portfolio-section" id="about-section">
      <div className="section-content">
        <div ref={titleRef} style={{ marginBottom: '1rem' }}>
          <h2 className="section-title">
            <span className="gradient-text-cyan">About Me</span>
          </h2>
        </div>

        <div className="about-grid">
          <div ref={bioRef}>
            <p className="about-bio">
              I'm <strong>{personalInfo.name}</strong>, a passionate Full Stack Developer 
              currently pursuing my B.Tech in Computer Science at SKIT, Jaipur. 
              I specialize in building scalable web applications using modern technologies 
              like React, Node.js, Java Spring Boot, and more.
            </p>
            <p className="about-bio" style={{ marginTop: '1rem' }}>
              With experience ranging from freelance projects to hands-on internships, 
              I bring a strong foundation in both frontend and backend development. 
              I'm driven by solving complex problems and creating impactful digital experiences.
            </p>
            <p className="about-bio" style={{ marginTop: '1rem' }}>
              Beyond web development, I've explored Web3 technologies, AI integrations, 
              and cross-platform app development, constantly expanding my technical horizons.
            </p>
          </div>

          <div ref={cardRef} className="glass-card about-edu-card">
            <div className="about-edu-label">🎓 Education</div>
            <div className="about-edu-name">{education.institute}</div>
            <div className="about-edu-detail">{education.degree}</div>
            <div className="about-edu-detail" style={{ color: 'var(--text-muted)' }}>
              {education.location} • {education.duration}
            </div>
            <div className="about-edu-cgpa">
              {education.cgpa} <span>CGPA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
