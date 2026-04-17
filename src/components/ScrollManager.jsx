import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { TOTAL_SECTIONS, ENTRY_END, EXIT_START } from '../utils/constants';
import { useSyncExternalStore } from 'react';

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// Module-level scroll store
// ============================================================

const _listeners = new Set();

export const scrollStore = {
  progress: 0,
  section: 0,
  getProgress: () => scrollStore.progress,
  getSection: () => scrollStore.section,
  subscribe: (fn) => {
    _listeners.add(fn);
    return () => _listeners.delete(fn);
  },
};

function _notify() {
  _listeners.forEach((fn) => fn(scrollStore.progress, scrollStore.section));
}

export function useScrollProgress() {
  return useSyncExternalStore(
    scrollStore.subscribe,
    scrollStore.getProgress
  );
}

export function useScrollSection() {
  return useSyncExternalStore(
    scrollStore.subscribe,
    scrollStore.getSection
  );
}

// ============================================================
// Initialize scroll tracking on the DOM scroll container.
// ============================================================
let _trigger = null;

export function initScrollTrigger() {
  if (_trigger) _trigger.kill();

  const container = document.querySelector('.scroll-container');
  if (!container) return;

  _trigger = ScrollTrigger.create({
    trigger: container,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
    
    // --- THE CUSTOM FRICTION ENGINE ---
    snap: {
      snapTo: (progress) => {
        const N = TOTAL_SECTIONS;
        const sliceSize = 1 / N;
        const sliceFloat = progress * N;
        const i = Math.floor(Math.min(sliceFloat, N - 1));
        const f = sliceFloat - i; // Fractional progress within current slice (0 to 1)

        // 1. FREE ZONE: If the user is inside the Dwell Zone (internal scrolling), do NOT snap.
        if (f >= ENTRY_END && f <= EXIT_START) {
          return progress; 
        }

        // 2. ENTRY FRICTION: User is entering the section
        if (f < ENTRY_END) {
          // If they pushed past the halfway point of the entry, pull them IN to the start of the dwell zone.
          if (f > (ENTRY_END / 2)) {
             return (i + ENTRY_END) * sliceSize;
          } else {
             // If they barely peeked, snap them BACK to the previous section's exit (Friction!)
             if (i === 0) return 0;
             return (i - 1 + EXIT_START) * sliceSize;
          }
        }

        // 3. EXIT FRICTION: User is leaving the section
        if (f > EXIT_START) {
          const exitProgress = (f - EXIT_START) / (1 - EXIT_START); 
          // If they pushed past the halfway point of the exit, pull them FORWARD to the next section.
          if (exitProgress > 0.5) {
            if (i === N - 1) return 1;
            return (i + 1 + ENTRY_END) * sliceSize;
          } else {
            // If they didn't scroll hard enough, rubber-band them BACK into the current section!
            return (i + EXIT_START) * sliceSize;
          }
        }

        return progress;
      },
      duration: { min: 0.2, max: 0.5 },
      delay: 0.1, // Tiny delay so it feels like physical resistance when they stop scrolling
      ease: "power2.out",
    },

    onUpdate: (self) => {
      scrollStore.progress = self.progress;
      scrollStore.section = Math.min(
        Math.floor(self.progress * TOTAL_SECTIONS),
        TOTAL_SECTIONS - 1
      );
      _notify();
    },
  });
}

export function destroyScrollTrigger() {
  if (_trigger) {
    _trigger.kill();
    _trigger = null;
  }
}