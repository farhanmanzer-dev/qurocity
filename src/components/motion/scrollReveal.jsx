import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Starting states for each legacy `data-aos` value.
const FROM = {
  "fade-up": { y: 60, opacity: 0 },
  "fade-down": { y: -40, opacity: 0 },
  "fade-right": { x: -80, opacity: 0 },
  "fade-left": { x: 80, opacity: 0 },
  "zoom-in": { scale: 0.85, y: 40, opacity: 0 },
};

/**
 * Wraps page content and animates it as it scrolls into view:
 *  - section headings split into words that rise in,
 *  - `[data-aos]` elements fade/slide in (staggered when they enter together),
 *  - `[data-parallax]` elements drift with the scroll position.
 */
const ScrollReveal = ({ children }) => {
  const scope = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Headings: word-by-word mask reveal.
        gsap.utils.toArray("h1[data-aos]", scope.current).forEach((h) => {
          const split = SplitText.create(h, {
            type: "words",
            mask: "words",
            wordsClass: "split-word",
          });
          gsap.from(split.words, {
            yPercent: 110,
            rotate: 4,
            duration: 1,
            ease: "expo.out",
            stagger: 0.05,
            scrollTrigger: { trigger: h, start: "top 88%" },
          });
        });

        // 2. Everything else tagged with data-aos, batched for natural stagger.
        Object.entries(FROM).forEach(([type, from]) => {
          const els = gsap.utils
            .toArray(`[data-aos="${type}"]`, scope.current)
            .filter((el) => el.tagName !== "H1");
          if (!els.length) return;
          gsap.set(els, from);
          ScrollTrigger.batch(els, {
            start: "top 90%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
                duration: 1.1,
                ease: "power3.out",
                stagger: 0.12,
                overwrite: true,
              }),
          });
        });

        // 3. Scroll-scrubbed parallax.
        gsap.utils.toArray("[data-parallax]", scope.current).forEach((el) => {
          const amount = parseFloat(el.dataset.parallax) || 60;
          gsap.fromTo(
            el,
            { y: amount },
            {
              y: -amount,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });
      });

      // Images load late and change layout; recompute trigger positions.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      return () => window.removeEventListener("load", refresh);
    },
    { scope }
  );

  return <main ref={scope}>{children}</main>;
};

export default ScrollReveal;
