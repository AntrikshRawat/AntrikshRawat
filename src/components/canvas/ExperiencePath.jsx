import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../ScrollManager';

export default function ExperiencePath() {
  const groupRef = useRef();
  const tubeRef = useRef();
  const particlesRef = useRef();

  // Define the experience timeline curve
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(2, 4, -135),
      new THREE.Vector3(5, 4, -150),
      new THREE.Vector3(8, 4, -165),
    ]);
  }, []);

  // Marker positions along the curve
  const markers = useMemo(() => {
    return [
      { t: 0.1, color: '#00f5ff', label: 'Kistechno' },
      { t: 0.5, color: '#b44aff', label: 'Freelance' },
      { t: 0.9, color: '#ff006e', label: 'Cynbit' },
    ];
  }, []);

  // Particles flowing along the tube
  const particleCount = 50;
  const particlePositions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);
  const particleOffsets = useMemo(() => {
    const arr = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      arr[i] = Math.random();
    }
    return arr;
  }, [particleCount]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const progress = scrollStore.getProgress();

    if (groupRef.current) {
      // Dynamic shift based on scroll
      groupRef.current.position.y = Math.sin(progress * Math.PI) * 2;
      groupRef.current.rotation.x = progress * 1.5;
    }

    // Animate particles along curve
    for (let i = 0; i < particleCount; i++) {
      const offset = (particleOffsets[i] + t * 0.05 + progress * 0.5) % 1;
      const point = curve.getPoint(offset);
      particlePositions[i * 3] = point.x + (Math.random() - 0.5) * 0.15;
      particlePositions[i * 3 + 1] = point.y + (Math.random() - 0.5) * 0.15;
      particlePositions[i * 3 + 2] = point.z + (Math.random() - 0.5) * 0.15;
    }
    if (particlesRef.current) {
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Tube geometry along curve */}
      <mesh ref={tubeRef}>
        <tubeGeometry args={[curve, 64, 0.03, 8, false]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Wireframe outer tube */}
      <mesh>
        <tubeGeometry args={[curve, 64, 0.08, 8, false]} />
        <meshStandardMaterial
          color="#b44aff"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Markers */}
      {markers.map((marker, i) => {
        const pos = curve.getPoint(marker.t);
        return (
          <group key={i} position={[pos.x, pos.y, pos.z]}>
            <mesh>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial
                color={marker.color}
                emissive={marker.color}
                emissiveIntensity={0.6}
              />
            </mesh>
            {/* Glowing ring around marker */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.25, 0.01, 16, 32]} />
              <meshStandardMaterial
                color={marker.color}
                emissive={marker.color}
                emissiveIntensity={0.3}
                transparent
                opacity={0.5}
              />
            </mesh>
          </group>
        );
      })}

      {/* Flowing particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#00f5ff"
          size={0.04}
          sizeAttenuation
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
