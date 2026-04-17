import React, { useState } from 'react';
import { SECTIONS } from '../utils/constants';
import { useScrollSection } from './ScrollManager';

export default function Navbar({ visible }) {
  const section = useScrollSection();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleClick = (index) => {
    setMobileOpen(false);
    const totalHeight = document.querySelector('.scroll-container')?.scrollHeight || 0;
    const sectionHeight = totalHeight / SECTIONS.length;
    const target = sectionHeight * index;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${visible ? '' : 'hidden'}`} id="navbar">
      <a className="navbar-logo" href="#">
        &lt;AR /&gt;
      </a>
      <button className="navbar-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">
        {mobileOpen ? '✕' : '☰'}
      </button>
      <ul className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
        {SECTIONS.map((s, i) => (
          <li key={s.id}>
            <button className={`navbar-link ${section === i ? 'active' : ''}`} onClick={() => handleClick(i)} id={`nav-${s.id}`}>
              {s.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
