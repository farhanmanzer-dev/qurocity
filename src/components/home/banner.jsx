import { Fragment, lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FcOvertime, FcManager, FcReadingEbook, FcExpand } from "react-icons/fc";
import Magnetic from "../motion/magnetic";
import "./style.css";
import "./motion.css";

const HeroScene = lazy(() => import("./heroScene"));

const greetings = [
  { word: "Hola", lang: "Spanish", x: "4%", y: "14%", depth: 40 },
  { word: "Bonjour", lang: "French", x: "70%", y: "6%", depth: -30 },
  { word: "こんにちは", lang: "Japanese", x: "78%", y: "62%", depth: 55 },
  { word: "안녕하세요", lang: "Korean", x: "0%", y: "70%", depth: -45 },
  { word: "Hallo", lang: "German", x: "40%", y: "88%", depth: 25 },
  { word: "你好", lang: "Mandarin", x: "38%", y: "-2%", depth: -20 },
];

const reasons = [
  {
    icon: <FcOvertime size={48} />,
    title: "Flexibility and Convenience",
    content:
      "Learn anytime, anywhere, fitting seamlessly into busy schedules, unlike fixed offline classes.",
  },
  {
    icon: <FcManager size={48} />,
    title: "Expert Tutors and Cutting-Edge Technology",
    content:
      "Highly qualified tutors and innovative tools keep students engaged and motivated, ensuring superior learning.",
  },
  {
    icon: <FcReadingEbook size={48} />,
    title: "Culturally Rich Content",
    content:
      "Lessons include cultural context, preparing learners for real-world communication and interactions.",
  },
];

const stats = [
  { value: 11, suffix: "+", label: "Languages" },
  { value: 20, suffix: " yrs", label: "Ed-tech experience" },
  { value: 1499, prefix: "₹", label: "Courses from" },
];

const words = (text, className = "") =>
  text.split(" ").map((w, i) => (
    <Fragment key={i}>
      <span className="word-mask">
        <span className="hero-word">
          <span className={className}>{w}</span>
        </span>
      </span>{" "}
    </Fragment>
  ));

// Floating greeting chip that drifts against the mouse for depth.
const Chip = ({ g, i, mx, my }) => {
  const x = useTransform(mx, (v) => v * g.depth);
  const y = useTransform(my, (v) => v * g.depth);
  return (
    <motion.div
      className="hero-chip hover-target"
      style={{ left: g.x, top: g.y, x, y }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1 + i * 0.1, type: "spring", stiffness: 260, damping: 14 }}
      whileHover={{ scale: 1.12 }}
    >
      <strong>{g.word}</strong>
      <small>{g.lang}</small>
    </motion.div>
  );
};

const BannerSection = () => {
  const [slide, setSlide] = useState(0);
  const root = useRef(null);
  const scrollRef = useRef(0);

  // Normalised mouse position (-1..1) shared by the chips.
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });

  useEffect(() => {
    const onMove = (e) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % 2), 10000);
    return () => clearInterval(id);
  }, [slide]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Intro sequence.
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.8 })
          .from(".hero-word", { yPercent: 115, rotate: 6, duration: 1.2, stagger: 0.06 }, "-=0.5")
          .fromTo(
            ".hero-swash path",
            { strokeDashoffset: 320 },
            { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" },
            "-=0.6"
          )
          .from(".hero-fade", { y: 30, opacity: 0, duration: 1, stagger: 0.12 }, "-=0.8")
          .from(".hero-canvas-wrap", { scale: 0.6, opacity: 0, duration: 1.8 }, 0.2);

        // Count-up stats.
        gsap.utils.toArray(".hero-stat-num").forEach((el) => {
          const obj = { v: 0 };
          gsap.to(obj, {
            v: Number(el.dataset.value),
            duration: 2.2,
            delay: 0.9,
            ease: "power2.out",
            onUpdate: () => (el.textContent = Math.round(obj.v).toLocaleString("en-IN")),
          });
        });

        // Scroll away: text lifts, globe sinks and spins faster.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
              onUpdate: (self) => (scrollRef.current = self.progress),
            },
          })
          .to(".hero-copy", { y: -120, opacity: 0, ease: "none" }, 0)
          .to(".hero-visual", { y: 160, ease: "none" }, 0);
      });
    },
    { scope: root }
  );

  const scrollNext = () => {
    const next = root.current.nextElementSibling;
    if (!next) return;
    const y = next.getBoundingClientRect().top + window.scrollY;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section className="hero" ref={root}>
      <div className="hero-bg" aria-hidden="true">
        <span className="hero-blob hero-blob-1" />
        <span className="hero-blob hero-blob-2" />
        <span className="hero-grid" />
      </div>

      <div className="container">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="hero-dot" /> Bharat&apos;s language learning app
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {slide === 0 ? (
                <motion.div
                  key="intro"
                  className="hero-slide"
                  initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                  transition={{ duration: 0.45 }}
                >
                  <h1 className="hero-title">
                    {words("Expand your world with personalized")}
                    <span className="hero-accent">
                      {words("language learning", "hero-word-accent")}
                      <svg className="hero-swash" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                        <path d="M3 14 C 60 4, 140 2, 297 9" />
                      </svg>
                    </span>
                  </h1>
                  <h4 className="hero-fade hero-sub">Master any language, anytime, anywhere</h4>
                  <p className="hero-fade">
                    Qurocity is here to kick-start your language journey with fun,
                    pocket-size chapters curated by the best language experts — an
                    unforgettable learning experience that comes in handy across
                    your career and multilingual life.
                  </p>
                  <div className="hero-fade hero-actions">
                    <Magnetic>
                      <button className="custom-dark-btn hero-btn">
                        <span>Download the App now!</span>
                      </button>
                    </Magnetic>
                    <button className="hero-ghost-btn" onClick={() => setSlide(1)}>
                      Why Qurocity?
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="reasons"
                  className="hero-slide"
                  initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="hero-title hero-title-sm">Why we stand out from competitors</h1>
                  {reasons.map((r, i) => (
                    <motion.div
                      className="banner-box-list hover-target"
                      key={r.title}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.12, duration: 0.5 }}
                      whileHover={{ x: 8 }}
                    >
                      <div className="banner-box-item-left">{r.icon}</div>
                      <div className="banner-box-item-right">
                        <h4>{r.title}</h4>
                        <p>{r.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  <button className="hero-ghost-btn" onClick={() => setSlide(0)}>
                    ← Back
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="hero-fade hero-stats">
              {stats.map((s) => (
                <div className="hero-stat" key={s.label}>
                  <span className="hero-stat-value">
                    {s.prefix}
                    <span className="hero-stat-num" data-value={s.value}>
                      {s.value.toLocaleString("en-IN")}
                    </span>
                    {s.suffix}
                  </span>
                  <span className="hero-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-canvas-wrap">
              <Suspense fallback={null}>
                <HeroScene scrollRef={scrollRef} />
              </Suspense>
            </div>
            {greetings.map((g, i) => (
              <Chip key={g.word} g={g} i={i} mx={mx} my={my} />
            ))}
          </div>
        </div>

        <div className="hero-dots">
          {[0, 1].map((i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              className={`hero-dot-btn ${slide === i ? "active" : ""}`}
              onClick={() => setSlide(i)}
            />
          ))}
        </div>

        <button className="hero-scroll hover-target" onClick={scrollNext} aria-label="Scroll down">
          <FcExpand size={20} />
        </button>
      </div>
    </section>
  );
};

export default BannerSection;
