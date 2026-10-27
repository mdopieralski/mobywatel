import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { RefObject } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** A stop this close to a section's start (share of the window height) settles on that section. */
const PULL = 0.35;

/**
 * Landing page: when scrolling stops near the start of a section (a child of `container`), the page glides
 * so that section sits right under the pinned header. Far from any start (inside the long "what is new"
 * section) it stays where the visitor left it, so nothing is ever out of reach. Off with
 * prefers-reduced-motion.
 */
export function useSectionSnap(container: RefObject<HTMLElement | null>, header: () => HTMLElement | null) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        ScrollTrigger.create({
          start: 0,
          end: 'max',
          snap: {
            snapTo: (progress, self) => {
              const max = ScrollTrigger.maxScroll(window);
              const sections = container.current?.children;
              if (!max || !sections) {
                return progress;
              }
              const y = progress * max;
              const offset = header()?.offsetHeight ?? 0;
              // Only sections ahead in the direction of travel: a short scroll away from a section is never
              // pulled back to it.
              const direction = self?.direction ?? 0;
              let nearest = y;
              let distance = Infinity;
              for (const section of sections) {
                const start = Math.min(
                  max,
                  Math.max(0, section.getBoundingClientRect().top + window.scrollY - offset)
                );
                if ((direction > 0 && start < y) || (direction < 0 && start > y)) {
                  continue;
                }
                if (Math.abs(start - y) < distance) {
                  distance = Math.abs(start - y);
                  nearest = start;
                }
              }
              return distance < window.innerHeight * PULL ? nearest / max : progress;
            },
            duration: { min: 0.2, max: 0.6 },
            delay: 0.15,
            ease: 'power2.inOut',
            inertia: false,
          },
        });
      });
      return () => mm.revert();
    },
    { dependencies: [] }
  );
}
