import React, { useState, useRef, useCallback, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import Loader from './components/Loader';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import { initScrollTrigger, destroyScrollTrigger } from './components/ScrollManager';
import Scene3D from './components/canvas/Scene3D';
import ResponsiveCamera from './components/canvas/ResponsiveCamera';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function App() {
  const [phase, setPhase] = useState('loading');
  const introRef = useRef();
  const introNameRef = useRef();
  const introTitleRef = useRef();
  const loaderRef = useRef();

  const handleLoaded = useCallback(() => {
    setPhase('intro');
  }, []);

  // Intro animation
  useEffect(() => {
    if (phase !== 'intro') return;

    const tl = gsap.timeline({
      onComplete: () => setPhase('ready'),
    });

    if (loaderRef.current) {
      tl.to(loaderRef.current, { opacity: 0, duration: 0.5, ease: 'power2.inOut' });
    }

    tl.fromTo(introNameRef.current,
      { opacity: 0, scale: 0.8, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'back.out(1.5)' },
      '+=0.2'
    );

    tl.fromTo(introTitleRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    );

    tl.to({}, { duration: 0.8 });

    tl.to(introRef.current, {
      opacity: 0, duration: 0.6, ease: 'power2.inOut',
    });

    return () => tl.kill();
  }, [phase]);

  // Init scroll tracking after sections mount
  useEffect(() => {
    if (phase === 'ready') {
      window.scrollTo(0, 0); // Force scroll reset to top
      const timeout = setTimeout(() => {
        initScrollTrigger();
        ScrollTrigger.refresh();
      }, 300);
      return () => {
        clearTimeout(timeout);
        destroyScrollTrigger();
      };
    }
  }, [phase]);

  return (
    <>
      {/* 3D Canvas — fixed fullscreen background */}
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 6, 40], fov:60, near: 0.1, far: 500 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 1.5]}
          style={{ background: '#0a0a0f' }}
        >
          <ResponsiveCamera/>
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>
      </div>

      {/* Loading Screen */}
      {(phase === 'loading' || phase === 'intro') && (
        <div ref={loaderRef}>
          {phase === 'loading' && <Loader onLoaded={handleLoaded} />}
        </div>
      )}

      {/* Intro Animation */}
      {phase === 'intro' && (
        <div ref={introRef} className="intro-overlay">
          <h1 ref={introNameRef} className="intro-name-large gradient-text">
            Antriksh Rawat
          </h1>
          <p ref={introTitleRef} className="intro-title">
            Full Stack Developer
          </p>
        </div>
      )}

      {/* Navbar */}
      <Navbar visible={phase === 'ready'} />

      {phase === 'ready' && (
        <>
          <div className="global-footer" style={{ position: 'fixed', bottom: '1rem', left: '1rem', zIndex: 50, fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', opacity: 0.8 }}>
            Made With ❤️ By Antriksh Rawat
          </div>
          <MusicPlayer/>
          <div className="scroll-container" style={{ width: '100%', height: '700vh' }} />
        </>
      )}
    </>
  );
}
