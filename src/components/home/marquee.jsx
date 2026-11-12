import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const rowA = ["Hello", "Bonjour", "Hola", "Hallo", "Olá", "Привет", "Hej", "Ciao"];
const rowB = ["こんにちは", "你好", "안녕하세요", "مرحبا", "नमस्ते", "नमः", "Salaam", "Merhaba"];

// Two rows of greetings that slide in opposite directions as you scroll.
const Marquee = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.5 };
        gsap.fromTo(".marquee-row-a", { xPercent: 0 }, { xPercent: -30, ease: "none", scrollTrigger: st });
        gsap.fromTo(".marquee-row-b", { xPercent: -30 }, { xPercent: 0, ease: "none", scrollTrigger: st });
      });
    },
    { scope: root }
  );

  const row = (items, cls) => (
    <div className={`marquee-row ${cls}`}>
      {[...items, ...items].map((w, i) => (
        <span key={i} className="marquee-item">
          {w}
          <i className="marquee-star">✦</i>
        </span>
      ))}
    </div>
  );

  return (
    <section className="marquee" ref={root} aria-hidden="true">
      {row(rowA, "marquee-row-a")}
      {row(rowB, "marquee-row-b marquee-outline")}
    </section>
  );
};

export default Marquee;
