import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./style.css";

const INTERACTIVE = "a, button, .hover-target, .swiper-button-next, .swiper-button-prev";

const CustomCursor = () => {
  const outer = useRef(null);
  const inner = useRef(null);

  useEffect(() => {
    // No custom cursor on touch devices.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.body.classList.add("has-custom-cursor");

    const setOuterX = gsap.quickTo(outer.current, "x", { duration: 0.45, ease: "power3" });
    const setOuterY = gsap.quickTo(outer.current, "y", { duration: 0.45, ease: "power3" });
    const setInnerX = gsap.quickTo(inner.current, "x", { duration: 0.12, ease: "power3" });
    const setInnerY = gsap.quickTo(inner.current, "y", { duration: 0.12, ease: "power3" });

    const move = (e) => {
      if (!document.body.classList.contains("cursor-ready")) {
        // First movement: jump into place instead of gliding in from the corner.
        gsap.set([outer.current, inner.current], { x: e.clientX, y: e.clientY });
        document.body.classList.add("cursor-ready");
      }
      setOuterX(e.clientX);
      setOuterY(e.clientY);
      setInnerX(e.clientX);
      setInnerY(e.clientY);
    };

    // Event delegation, so elements rendered later are picked up too.
    const over = (e) => {
      const hit = e.target.closest?.(INTERACTIVE);
      outer.current.classList.toggle("cursor-hover", !!hit);
      inner.current.classList.toggle("cursor-hover", !!hit);
    };
    const down = () => gsap.to(outer.current, { scale: 0.7, duration: 0.15 });
    const up = () => gsap.to(outer.current, { scale: 1, duration: 0.3, ease: "back.out(3)" });
    const leave = () => gsap.to([outer.current, inner.current], { opacity: 0, duration: 0.2 });
    const enter = () => gsap.to([outer.current, inner.current], { opacity: 1, duration: 0.2 });

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);

    return () => {
      document.body.classList.remove("has-custom-cursor", "cursor-ready");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
    };
  }, []);

  return (
    <>
      <div ref={outer} className="mouse-cursor cursor-outer" />
      <div ref={inner} className="mouse-cursor cursor-inner" />
    </>
  );
};

export default CustomCursor;
