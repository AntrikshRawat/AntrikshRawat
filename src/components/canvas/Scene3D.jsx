import React, { Suspense, useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import {
  SECTION_POSITIONS,
  getSectionAnimationState,
  isSectionDwelling,
  ENTRY_END,
  EXIT_START,
  TOTAL_SECTIONS,
} from "../../utils/constants";
import { scrollStore } from "../ScrollManager";

import CameraRig from "./CameraRig";
import Lighting from "./Lighting";
import Particles from "./Particles";
import CosmicBackground from "./CosmicBackground";
import BackgroundAura from "./BackgroundAura";
import GlobalPipeline from "./GlobalPipeline";
import ExperiencePath from "./ExperiencePath";
import ProjectCards3D from "./ProjectCards3D";

import HeroSection from "../sections/HeroSection";
import AboutSection from "../sections/AboutSection";
import SkillsSection from "../sections/SkillsSection";
import ExperienceSection from "../sections/ExperienceSection";
import ProjectsSection from "../sections/ProjectsSection";
import AchievementsSection from "../sections/AchievementsSection";
import ContactSection from "../sections/ContactSection";

const SECTIONS_COMPONENTS = [
  HeroSection,
  AboutSection,
  SkillsSection,
  ExperienceSection,
  ProjectsSection,
  AchievementsSection,
  ContactSection,
];

// ── Constants ──
const NAVBAR_HEIGHT = 56; // px — matches the navbar's padding + content
const CSS_BASE_WIDTH = 1000; // CSS px that fills viewport width at distanceFactor=10

function BillboardSection({ component: Component, index }) {
  const groupRef = useRef();
  const divRef = useRef();
  const scrollRef = useRef();

  // Pre-computed section position — above the pipe, fixed distance forward
  const position = useMemo(() => {
    const p = SECTION_POSITIONS[index];
    return [p.x, p.y, p.z];
  }, [index]);

  // ── Proportional progress mapping for seamless touch/desktop tracking ──
  useFrame((state) => {
    // Billboard dynamically faces the camera every frame
    if (groupRef.current) {
      groupRef.current.lookAt(state.camera.position);
    }

    if (!divRef.current) return;
    const progress = scrollStore.getProgress();

    // Get animation state (enter / dwell / exit) for this section
    const anim = getSectionAnimationState(progress, index);

    // Track dwell state
    const dwelling = isSectionDwelling(progress, index);

    // ── Proportional Internal Scrolling ──
    const el = scrollRef.current;
    if (el) {
      const sliceFloat = progress * TOTAL_SECTIONS;
      const sliceProgress = sliceFloat - index;

      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll > 2) {
        let t = 0;
        if (sliceProgress >= EXIT_START) {
          t = 1; // force bottom
        } else if (sliceProgress > ENTRY_END) {
          t = (sliceProgress - ENTRY_END) / (EXIT_START - ENTRY_END);
        }
        el.scrollTop = maxScroll * t;
      }
    }

    // Apply animated transforms
    divRef.current.style.opacity = anim.opacity;
    divRef.current.style.visibility = anim.visible ? "visible" : "hidden";
    divRef.current.style.transform = `translateY(${anim.translateY}px) scale(${anim.scale}) perspective(800px) rotateX(${anim.rotateX}deg)`;
    divRef.current.style.filter =
      anim.blur > 0.1 ? `blur(${anim.blur}px)` : "none";
    divRef.current.style.pointerEvents = anim.opacity > 0.85 ? "auto" : "none";

    // Reset inner scroll when section is fully hidden (re-enter starts from top)
    if (scrollRef.current && anim.opacity < 0.05) {
      scrollRef.current.scrollTop = 0;
    }
  });

  return (
    <group position={position} ref={groupRef}>
      <Html transform center distanceFactor={10} zIndexRange={[100, 0]}>
        <div
          ref={divRef}
          className="billboard-wrapper"
          style={{
            width: "100dvw",
            maxWidth: `${CSS_BASE_WIDTH}px`,
            height: "100dvh",
            marginTop: "10dvh",
            marginBottom: "10dvh",
            maxHeight: "800px",
            opacity: 0,
            willChange: "transform, opacity, filter",
            transformOrigin: "center center",
            overflow: "hidden",
          }}
        >
          <div
            ref={scrollRef}
            className="billboard-scroll"
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden", // Hidden because useFrame proportionality handles the scroll
            }}
          >
            <Component />
          </div>
        </div>
      </Html>
    </group>
  );
}

export default function Scene3D() {
  return (
    <>
      <CameraRig />
      <Lighting />

      {/* Background elements */}
      <Particles count={3000} />
      <CosmicBackground />
      <BackgroundAura />
      <GlobalPipeline />

      {/* 3D Native HTML Billboards hooked to Pipe */}
      <Suspense fallback={null}>
        {SECTIONS_COMPONENTS.map((Comp, i) => (
          <BillboardSection key={i} component={Comp} index={i} />
        ))}
      </Suspense>

      <Suspense fallback={null}>
        <ExperiencePath />
      </Suspense>

      <Suspense fallback={null}>
        <ProjectCards3D />
      </Suspense>

      {/* Fog for depth — extended range for above-pipe viewing */}
      <fog attach="fog" args={["#0a0a0f", 10, 120]} />
    </>
  );
}
