import * as THREE from 'three';

// Color palette
export const COLORS = {
  bgPrimary: "#0a0a0f",
  bgSecondary: "#12121a",
  bgGlass: "rgba(255,255,255,0.05)",
  accentCyan: "#00f5ff",
  accentPurple: "#b44aff",
  accentMagenta: "#ff006e",
  textPrimary: "#ffffff",
  textSecondary: "#a0a0b8",
};

// Three.js color values (hex integers)
export const COLORS_THREE = {
  cyan: 0x00f5ff,
  purple: 0xb44aff,
  magenta: 0xff006e,
  darkBg: 0x0a0a0f,
  warmWhite: 0xfff5e6,
  coolBlue: 0x4466ff,
};

// Section definitions
export const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

export const TOTAL_SECTIONS = SECTIONS.length;

// ── Pipeline curve (single source of truth) ──────────────────
export const PIPELINE_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 40),
  new THREE.Vector3(0, 0, 15),       // Hero
  new THREE.Vector3(5, 2, -45),      // About
  new THREE.Vector3(-10, -3, -95),   // Skills
  new THREE.Vector3(5, 4, -150),     // Experience
  new THREE.Vector3(-8, 1, -200),    // Projects
  new THREE.Vector3(4, 3, -250),     // Achievements
  new THREE.Vector3(0, 0, -310),     // Contact
]);

// ── Height offsets ───────────────────────────────────────────
export const CAMERA_Y_OFFSET = 6;     // Camera rides above pipe centre
export const SECTION_Y_OFFSET = 4;    // Sections sit on top of the pipe
export const VIEWING_DISTANCE = 14;   // Fixed forward offset (consistent for all sections)

// ── Derived positions ────────────────────────────────────────
// Curve point at each section's t-value
export const SECTION_CURVE_POINTS = SECTIONS.map((_, i) => {
  const t = i / (TOTAL_SECTIONS - 1);
  return PIPELINE_CURVE.getPoint(t);
});

// Tangent direction at each section (projected onto XZ plane for consistency)
export const SECTION_TANGENTS = SECTIONS.map((_, i) => {
  const t = i / (TOTAL_SECTIONS - 1);
  const tangent = PIPELINE_CURVE.getTangent(t);
  // Project onto XZ plane and normalize — removes Y-tilt so every
  // section is at the same horizontal distance from the camera
  const forward = new THREE.Vector3(tangent.x, 0, tangent.z).normalize();
  return forward;
});

// 3D billboard positions — above the pipe, fixed distance forward
export const SECTION_POSITIONS = SECTION_CURVE_POINTS.map((point, i) => {
  const forward = SECTION_TANGENTS[i];
  return new THREE.Vector3(
    point.x + forward.x * VIEWING_DISTANCE,
    point.y + SECTION_Y_OFFSET,
    point.z + forward.z * VIEWING_DISTANCE
  );
});

// Camera waypoints (derived from curve, kept for compatibility)
export const CAMERA_WAYPOINTS = SECTION_CURVE_POINTS.map((point, i) => ({
  pos: [point.x, point.y + CAMERA_Y_OFFSET, point.z],
  lookAt: [SECTION_POSITIONS[i].x, SECTION_POSITIONS[i].y, SECTION_POSITIONS[i].z],
}));

// ── Explicit dwell zone parameters ──────────────────────────
// Each section gets an equal 1/7 slice of total scroll progress.
// Within each slice: [0, ENTRY_END) = entry | [ENTRY_END, EXIT_START] = dwell | (EXIT_START, 1] = exit
export const ENTRY_END = 0.20;   // first 20% of slice = entry transition
export const EXIT_START = 0.80;  // last 20% of slice = exit transition

// ── Camera progress mapping with explicit dwell zones ───────
// During dwell the camera is LOCKED at the section's curve position.
// During entry/exit it transitions smoothly between sections.
export function remapProgressWithDwell(progress) {
  const N = TOTAL_SECTIONS;   // 7
  const segments = N - 1;     // 6

  const sliceFloat = progress * N;
  const i = Math.min(Math.floor(sliceFloat), N - 1);
  const f = sliceFloat - i;   // 0→1 within this slice

  const curT = i / segments;

  if (f <= ENTRY_END) {
    // ── Entry: camera arriving from previous section ──
    if (i === 0) return curT;                   // first section — no previous
    const prevT = (i - 1) / segments;
    const halfT = 0.5 + (f / ENTRY_END) * 0.5; // map to second half of smoothstep
    const eased = halfT * halfT * (3 - 2 * halfT);
    return THREE.MathUtils.lerp(prevT, curT, eased);
  }

  if (f >= EXIT_START) {
    // ── Exit: camera leaving toward next section ──
    if (i >= segments) return curT;              // last section — no next
    const nextT = (i + 1) / segments;
    const halfT = ((f - EXIT_START) / (1 - EXIT_START)) * 0.5; // first half of smoothstep
    const eased = halfT * halfT * (3 - 2 * halfT);
    return THREE.MathUtils.lerp(curT, nextT, eased);
  }

  // ── Dwell: camera LOCKED at current section ──
  return curT;
}

// ── Precise dwell check for scroll locking ──────────────────
// Returns true when the given section is in its dwell zone.
export function isSectionDwelling(progress, sectionIndex) {
  const N = TOTAL_SECTIONS;
  const sliceFloat = progress * N;
  const i = Math.floor(Math.min(sliceFloat, N - 1));
  const f = sliceFloat - i;
  return i === sectionIndex && f >= ENTRY_END && f <= EXIT_START;
}

// ── Section animation state ─────────────────────────────────
// Fully symmetric — enter and exit use identical thresholds and easing.
// Forward-enter feels the same as backward-exit (and vice versa).
export function getSectionAnimationState(progress, sectionIndex) {
  const N = TOTAL_SECTIONS;
  const sliceSize = 1 / N;
  const sectionCenter = (sectionIndex + 0.5) * sliceSize;
  const dist = (progress - sectionCenter) / sliceSize;
  const absDist = Math.abs(dist);

  // Symmetric thresholds — same distance to appear/disappear on both sides
  const VISIBLE_THRESHOLD = 0.35; // fully visible within this distance
  const HIDDEN_THRESHOLD  = 0.7;  // fully hidden beyond this distance

  const isFirst = sectionIndex === 0;
  const isLast  = sectionIndex === N - 1;

  // ── Edge cases: first/last section stay visible at extremes ──
  if (absDist > HIDDEN_THRESHOLD) {
    if (isFirst && dist < 0) {
      return { visible: true, opacity: 1, scale: 1, translateY: 0, rotateX: 0, blur: 0 };
    }
    if (isLast && dist > 0) {
      return { visible: true, opacity: 1, scale: 1, translateY: 0, rotateX: 0, blur: 0 };
    }
    return { visible: false, opacity: 0, scale: 0.8, translateY: 80, rotateX: 8, blur: 6 };
  }

  let opacity, factor; // factor: 0 = fully visible, 1 = fully hidden

  if (absDist <= VISIBLE_THRESHOLD) {
    // ── DWELL — fully visible ──
    opacity = 1;
    factor = 0;
  } else {
    // ── TRANSITION — same easing for both enter and exit ──
    // Skip animation for first section's enter side and last section's exit side
    if ((isFirst && dist < 0) || (isLast && dist > 0)) {
      opacity = 1;
      factor = 0;
    } else {
      const t = (absDist - VISIBLE_THRESHOLD) / (HIDDEN_THRESHOLD - VISIBLE_THRESHOLD);
      const eased = t * t * (3 - 2 * t); // smoothstep
      opacity = 1 - eased;
      factor = eased;
    }
  }

  return {
    visible: opacity > 0.01,
    opacity: Math.max(0, Math.min(1, opacity)),
    scale: 1 - 0.2 * factor,
    translateY: factor * 80,   // always slide from/to below — symmetric
    rotateX: factor * 8,       // always tilt the same way
    blur: factor * 5,
  };
}

