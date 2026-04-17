import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../ScrollManager';

export default function Particles({ count = 2000 }) {
  const meshRef = useRef();
  const mathRef = useRef({ lastProgress: 0, velocity: 0 });

  const { positions, colors, sizes, initialZ } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const initialZ = new Float32Array(count);

    const colorCyan = new THREE.Color(0x00f5ff);
    const colorPurple = new THREE.Color(0xb44aff);
    const colorMagenta = new THREE.Color(0xff006e);

    for (let i = 0; i < count; i++) {
      // Extensive X/Y spread, deep Z spread
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      const zPos = Math.random() * -350 + 50; // Vastly expanded range
      positions[i * 3 + 2] = zPos;
      initialZ[i] = zPos;

      const color = new THREE.Color();
      
      const rand = Math.random();
      if (rand > 0.8) {
        color.lerpColors(colorCyan, colorPurple, Math.random());
      } else if (rand > 0.4) {
        color.lerpColors(colorPurple, colorMagenta, Math.random());
      } else {
        color.setHex(0xffffff);
      }
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 8 + 3;
    }

    return { positions, colors, sizes, initialZ };
  }, [count]);

  const starTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(0.8, 'rgba(255,255,255,0.1)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Constant rotation
    meshRef.current.rotation.y = time * 0.03;
    meshRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;

    // Scroll reactive warp speed effect
    const progress = scrollStore.getProgress();
    const progressDelta = progress - mathRef.current.lastProgress;
    mathRef.current.lastProgress = progress;
    
    // Calculate current scroll velocity, heavily damped
    mathRef.current.velocity += (progressDelta * 200 - mathRef.current.velocity) * 0.1;
    
    const positionsAttr = meshRef.current.geometry.attributes.position;
    const array = positionsAttr.array;

    for (let i = 0; i < count; i++) {
      // Base gentle drift
      const speed = 0.5 + Math.random() * 2;
      let z = array[i * 3 + 2] + (delta * speed);
      
      // Add warp speed from scrolling
      z += mathRef.current.velocity * speed * 2;

      // Loop particles back when they get too close behind camera or too far away
      if (z > 50) {
        z = -350; 
        array[i * 3] = (Math.random() - 0.5) * 120;
        array[i * 3 + 1] = (Math.random() - 0.5) * 100;
      } else if (z < -350) {
        z = 40; 
        array[i * 3] = (Math.random() - 0.5) * 120;
        array[i * 3 + 1] = (Math.random() - 0.5) * 100;
      }
      
      array[i * 3 + 2] = z;
    }
    positionsAttr.needsUpdate = true;
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
        map={starTexture}
        vertexColors
        size={0.15}
        sizeAttenuation={true}
        transparent
        alphaTest={0.01}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        fog={false}
      />
    </points>
  );
}
