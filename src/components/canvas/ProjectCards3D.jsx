import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { scrollStore } from '../ScrollManager';

const PROJECTS = [
  { title: 'WordChain', color: '#00f5ff', position: [-8, 2.5, -195], rotY: 0.2 },
  { title: 'Spend Manager', color: '#b44aff', position: [-8, 1, -200], rotY: 0 },
  { title: 'Med Reminder', color: '#ff006e', position: [-8, -0.5, -205], rotY: -0.2 },
];

function ProjectCard3D({ title, color, position, rotY }) {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const progress = scrollStore.getProgress();

    if (groupRef.current) {
      // Base float
      const baseRotY = rotY + Math.sin(t * 0.3 + position[0]) * 0.08;
      const baseRotX = Math.cos(t * 0.2) * 0.04;
      
      // Intense scroll reaction (they fly apart globally based on progress)
      groupRef.current.rotation.y = baseRotY + progress * 5 * position[0]; // Cards twist away from center
      groupRef.current.rotation.x = baseRotX + progress * 2;
      
      // Moving outward based on progress
      groupRef.current.position.x = position[0] * (1 + progress * 2);
      // Removed position.z override so that it stays anchored matching camera waypoints
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.6}>
      <group ref={groupRef} position={position}>
        {/* Card body */}
        <RoundedBox args={[2, 1.2, 0.05]} radius={0.06} smoothness={4}>
          <meshPhysicalMaterial
            color="#1a1a2e"
            emissive={color}
            emissiveIntensity={0.03}
            metalness={0.3}
            roughness={0.4}
            transparent
            opacity={0.85}
          />
        </RoundedBox>

        {/* Top accent line */}
        <mesh position={[0, 0.58, 0.03]}>
          <planeGeometry args={[1.9, 0.025]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Bottom accent line */}
        <mesh position={[0, -0.58, 0.03]}>
          <planeGeometry args={[1.2, 0.01]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.4}
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* Center decorative element */}
        <mesh position={[0, 0, 0.04]}>
          <ringGeometry args={[0.15, 0.18, 6]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Decorative corner dots */}
        {[[-0.9, 0.5], [0.9, 0.5], [-0.9, -0.5], [0.9, -0.5]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.04]}>
            <circleGeometry args={[0.02, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export default function ProjectCards3D() {
  return (
    <group>
      {PROJECTS.map((project) => (
        <ProjectCard3D key={project.title} {...project} />
      ))}
    </group>
  );
}
