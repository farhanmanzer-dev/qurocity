/* eslint-disable react/no-unknown-property -- react-three-fiber JSX props */
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

const COLORS = ["#4a00e1", "#8d3dfa", "#00bcf2", "#ff4141"];

// Evenly distributed points on a sphere (Fibonacci lattice).
const fibonacciSphere = (count, radius) => {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const a = new THREE.Color(COLORS[0]);
  const b = new THREE.Color(COLORS[2]);
  const c = new THREE.Color(COLORS[1]);
  const tmp = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    pos.set([Math.cos(t) * r * radius, y * radius, Math.sin(t) * r * radius], i * 3);
    const k = (y + 1) / 2;
    tmp.copy(a).lerp(b, k).lerp(c, Math.sin(t) * 0.25 + 0.25);
    col.set([tmp.r, tmp.g, tmp.b], i * 3);
  }
  return { pos, col };
};

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uMouse;
  attribute vec3 color;
  varying vec3 vColor;
  varying float vGlow;
  void main() {
    vec3 p = position;
    // Gentle breathing wave over the surface.
    float wave = sin(p.y * 2.2 + uTime * 1.4) * 0.05 + sin(p.x * 3.0 + uTime) * 0.03;
    p += normalize(p) * wave;
    // Points near the cursor lift off the globe.
    float d = distance(normalize(p), normalize(uMouse));
    float lift = smoothstep(0.7, 0.0, d);
    p += normalize(p) * lift * 0.35;
    vGlow = lift;
    vColor = mix(color, vec3(1.0, 0.25, 0.25), lift * 0.8);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (2.6 + lift * 5.0) * (6.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vGlow;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, alpha * (0.75 + vGlow * 0.25));
  }
`;

const Globe = ({ scrollRef }) => {
  const group = useRef();
  const points = useRef();
  const material = useRef();
  const scratch = useRef({ target: new THREE.Vector3(), inv: new THREE.Matrix4() });
  const { pos, col } = useMemo(() => fibonacciSphere(4200, 1.6), []);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uMouse: { value: new THREE.Vector3(0, 0, 1) } }),
    []
  );

  useFrame(({ pointer, clock }, delta) => {
    const u = material.current.uniforms;
    const { target, inv } = scratch.current;
    u.uTime.value = clock.elapsedTime;
    const scroll = scrollRef.current;

    // Lean the whole globe toward the pointer, spin faster as you scroll.
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -pointer.y * 0.35,
      0.05
    );
    points.current.rotation.y += delta * (0.12 + scroll * 1.2);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, pointer.x * 0.15, 0.05);

    // Cursor direction in the globe's local space, for the lift effect.
    target.set(pointer.x * 1.6, pointer.y * 1.6, 1.2);
    inv.copy(points.current.matrixWorld).invert();
    u.uMouse.value.lerp(target.applyMatrix4(inv), 0.15);
  });

  return (
    <group ref={group}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[col, 3]} />
        </bufferGeometry>
        <shaderMaterial
          ref={material}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </points>
      <mesh>
        <icosahedronGeometry args={[1.25, 2]} />
        <meshBasicMaterial color="#8d3dfa" wireframe transparent opacity={0.08} />
      </mesh>
      <Ring radius={2.15} tilt={[1.2, 0.3, 0]} speed={0.4} color="#00bcf2" />
      <Ring radius={2.45} tilt={[1.7, -0.5, 0.4]} speed={-0.28} color="#ff4141" />
    </group>
  );
};

// Thin orbit line with a satellite dot travelling around it.
const Ring = ({ radius, tilt, speed, color }) => {
  const sat = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    sat.current.position.set(Math.cos(t) * radius, Math.sin(t) * radius, 0);
  });
  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.004, 8, 200]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} />
      </mesh>
      <mesh ref={sat}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

// Ambient dust drifting around the globe (positions generated once).
const DUST = (() => {
  const a = new Float32Array(600 * 3);
  for (let i = 0; i < a.length; i++) a[i] = (Math.random() - 0.5) * 9;
  return a;
})();

const Dust = () => {
  const ref = useRef();
  const pos = DUST;
  useFrame((_, d) => (ref.current.rotation.y += d * 0.02));
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#8d3dfa" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
};

const HeroScene = ({ scrollRef }) => (
  <Canvas
    className="hero-canvas"
    camera={{ position: [0, 0, 6], fov: 45 }}
    dpr={[1, 2]}
    gl={{ antialias: true, alpha: true }}
    eventSource={document.body}
    eventPrefix="client"
  >
    <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.6}>
      <Globe scrollRef={scrollRef} />
    </Float>
    <Dust />
  </Canvas>
);

export default HeroScene;
