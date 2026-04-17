import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// ── 1. Nebula Clouds ──
function Nebula() {
  const count = 50;
  const meshRef = useRef();

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color(0x8e2de2),
      new THREE.Color(0x4a00e0),
      new THREE.Color(0x00f5ff),
      new THREE.Color(0xff006e),
      new THREE.Color(0x2a0845),
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
      positions[i * 3 + 2] = Math.random() * -500;

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, [count]);

  const cloudTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
    gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.4)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.01;
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        map={cloudTexture}
        vertexColors
        size={180}
        sizeAttenuation={true}
        transparent
        opacity={0.12}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        fog={false}
      />
    </points>
  );
}

// ── 2. Distant Wireframe Planet ──
function DistantPlanet() {
  const planetRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      planetRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * -0.03;
    }
  });

  return (
    <group position={[-80, 50, -450]} rotation={[0.4, -0.2, 0.2]}>
      <mesh ref={planetRef}>
        <sphereGeometry args={[40, 32, 32]} />
        <meshStandardMaterial
          color="#0f0c29"
          emissive="#302b63"
          emissiveIntensity={0.5}
          wireframe={true}
          transparent
          opacity={0.15}
          fog={false}
        />
        <mesh>
          <sphereGeometry args={[39.5, 32, 32]} />
          <meshBasicMaterial color="#000000" fog={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[42, 32, 32]} />
          <meshBasicMaterial
            color="#b44aff"
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            fog={false}
          />
        </mesh>
      </mesh>

      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[55, 75, 64]} />
        <meshBasicMaterial
          color="#00f5ff"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          wireframe={true}
          blending={THREE.AdditiveBlending}
          fog={false}
        />
      </mesh>
    </group>
  );
}

// ── 3. Shooting Stars (Light Streaks) ──
function ShootingStars() {
  const linesRef = useRef();
  const count = 15;

  const streaks = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * -400 - 50,
      ],
      speed: Math.random() * 2 + 1,
      length: Math.random() * 20 + 10,
    }));
  }, [count]);

  useFrame(() => {
    if (linesRef.current) {
      linesRef.current.children.forEach((streak, i) => {
        streak.position.z += streaks[i].speed;

        // Reset when they fly past the camera
        if (streak.position.z > 50) {
          streak.position.z = -450;
          streak.position.x = (Math.random() - 0.5) * 300;
        }
      });
    }
  });

  return (
    <group ref={linesRef}>
      {streaks.map((streak, i) => (
        <mesh
          key={i}
          position={streak.position}
          /* THE FIX: Lays the cylinder flat on its side so it points deep into space */
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.05, 0.05, streak.length, 4]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#00f5ff" : "#b44aff"}
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            fog={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── 4. Cyber Debris (Floating Geometries) ──
function CyberDebris() {
  const debrisRef = useRef();
  const count = 30;

  const pieces = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * -350, // Spread throughout the pipe
      ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      scale: Math.random() * 0.8 + 0.2,
      speedX: (Math.random() - 0.5) * 0.01,
      speedY: (Math.random() - 0.5) * 0.01,
    }));
  }, [count]);

  useFrame(() => {
    if (debrisRef.current) {
      debrisRef.current.children.forEach((piece, i) => {
        piece.rotation.x += pieces[i].speedX;
        piece.rotation.y += pieces[i].speedY;
      });
    }
  });

  return (
    <group ref={debrisRef}>
      {pieces.map((piece, i) => (
        <mesh
          key={i}
          position={piece.position}
          rotation={piece.rotation}
          scale={piece.scale}
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial
            color="#ff006e"
            wireframe={true}
            transparent
            opacity={0.15}
            fog={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── 5. Galactic Core (Dynamic Lighting) ──
function GalacticCore() {
  const coreRef = useRef();

  useFrame((state) => {
    if (coreRef.current) {
      // Gentle pulsing effect for the light
      coreRef.current.intensity =
        2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <group position={[0, 20, -400]}>
      <pointLight ref={coreRef} color="#b44aff" distance={500} decay={1.5} />
      {/* Visual glowing core */}
      <mesh>
        <sphereGeometry args={[20, 32, 32]} />
        <meshBasicMaterial
          color="#ff006e"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          fog={false}
        />
      </mesh>
    </group>
  );
}

// ── Main Export ──
export default function CosmicBackground() {
  return (
    <group>
      {/* Layer 1: Dense, tiny background stars */}
      <Stars
        radius={300}
        depth={200}
        count={6000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Layer 2: Larger, sparser, colorful foreground stars */}
      <Stars
        radius={200}
        depth={100}
        count={1500}
        factor={8}
        saturation={1}
        fade
        speed={2}
      />

      {/* Floating Elements */}
      <Nebula />
      <DistantPlanet />
      <ShootingStars />
      <CyberDebris />

      {/* Deep Space Lighting */}
      <GalacticCore />
    </group>
  );
}
