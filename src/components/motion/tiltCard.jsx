import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const spring = { stiffness: 220, damping: 18, mass: 0.6 };

/**
 * Card that tilts in 3D toward the pointer, with a glare spotlight that
 * follows the mouse. The outer wrapper is left free for scroll animations
 * (pass `data-aos` etc. through `wrapProps`).
 */
const TiltCard = ({ className = "", children, max = 10, wrapProps = {} }) => {
  const ref = useRef(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, rgba(141, 61, 250, 0.22), transparent 45%)`;

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className="tilt-wrap" {...wrapProps}>
      <motion.div
        ref={ref}
        className={`tilt-card hover-target ${className}`}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformPerspective: 900 }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", ...spring }}
      >
        <motion.span className="tilt-glare" style={{ background: glare }} />
        {children}
      </motion.div>
    </div>
  );
};

export default TiltCard;
