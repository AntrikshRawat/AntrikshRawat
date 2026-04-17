import React, { useRef, useEffect } from "react";
import { personalInfo } from "../../data/resumeData";

export default function HeroSection() {
  const sectionRef = useRef();
  const greetingRef = useRef();
  const nameRef = useRef();
  const taglineRef = useRef();

  return (
    <section ref={sectionRef} className="portfolio-section" id="hero-section">
      <div className="hero-content">
        <p ref={greetingRef} className="hero-greeting">
          Hello, I'm
        </p>
        <h1 ref={nameRef} className="hero-name">
          <span className="gradient-text">{personalInfo.name}</span>
        </h1>
        <p ref={taglineRef} className="hero-tagline">
          {personalInfo.title} — {personalInfo.tagline}
          <span className="cursor" />
        </p>
      </div>

      <div className="hero-scroll-indicator">
        <div className="hero-scroll-indicator-inner">
          <span>Scroll</span>
          <div className="scroll-arrow"></div>
        </div>
      </div>
    </section>
  );
}
