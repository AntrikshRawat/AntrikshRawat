import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../ScrollManager';

export default function BackgroundAura() {
  const meshRef = useRef();

  // Pre-allocate colors to avoid garbage collection spikes
  const colorA = useMemo(() => new THREE.Color('#0a1530'), []);
  const colorB = useMemo(() => new THREE.Color('#400040'), []);
  const colorC = useMemo(() => new THREE.Color('#400020'), []);
  const currentColor = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const progress = scrollStore.getProgress();

    if (meshRef.current && meshRef.current.material) {
      meshRef.current.rotation.x = t * 0.05 + progress * 2;
      meshRef.current.rotation.y = t * 0.05 - progress * 4;
      meshRef.current.rotation.z = t * 0.1;
      
      meshRef.current.position.z = -80 + progress * 20;

      // Efficient color interpolation via pre-allocated objects
      if (progress < 0.5) {
        currentColor.lerpColors(colorA, colorB, progress * 2);
      } else {
        currentColor.lerpColors(colorB, colorC, (progress - 0.5) * 2);
      }
      meshRef.current.material.color = currentColor;
      
      meshRef.current.material.emissiveIntensity = 0.2 + Math.abs(Math.sin(t)) * 0.1 + progress * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -80]}>
      {/* Reduced geometry segments significantly to save GPU limits */}
      <torusKnotGeometry args={[40, 6, 64, 16, 2, 3]} />
      <meshStandardMaterial
        color="#0a1530"
        emissive="#b44aff"
        emissiveIntensity={0.2}
        metalness={0.9}
        roughness={0.1}
        wireframe={true}
        transparent={true}
        opacity={0.15}
      />
    </mesh>
  );
}
