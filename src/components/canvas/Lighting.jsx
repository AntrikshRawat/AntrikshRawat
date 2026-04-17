import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { scrollStore } from '../ScrollManager';
import { COLORS_THREE } from '../../utils/constants';

export default function Lighting() {
  const pointCyanRef = useRef();
  const pointPurpleRef = useRef();
  const pointMagentaRef = useRef();

  useFrame((state) => {
    const progress = scrollStore.getProgress();
    const camPos = state.camera.position;

    // ── Traveling Headlights ──
    // The lights pulse based on scroll, AND they physically update their 
    // positions to stay perfectly arranged around the moving camera!

    if (pointCyanRef.current) {
      pointCyanRef.current.intensity = 2 + Math.sin(progress * Math.PI * 4) * 0.5;
      // Positioned slightly right and forward from the camera
      pointCyanRef.current.position.set(camPos.x + 3, camPos.y - 1, camPos.z - 5);
    }
    
    if (pointPurpleRef.current) {
      pointPurpleRef.current.intensity = 1.5 + Math.cos(progress * Math.PI * 3) * 0.5;
      // Positioned slightly left and further forward
      pointPurpleRef.current.position.set(camPos.x - 4, camPos.y + 1, camPos.z - 12);
    }
    
    if (pointMagentaRef.current) {
      pointMagentaRef.current.intensity = 1 + Math.sin(progress * Math.PI * 2 + 1) * 0.5;
      // Positioned directly below the camera to under-light objects
      pointMagentaRef.current.position.set(camPos.x, camPos.y - 4, camPos.z - 8);
    }
  });

  return (
    <>
      {/* Weak ambient light to ensure deep shadows aren't pitch black */}
      <ambientLight color={0x4466aa} intensity={0.15} />
      
      {/* Global directional light acting as a distant cosmic sun */}
      <directionalLight position={[5, 8, 5]} color={COLORS_THREE.warmWhite} intensity={0.6} />
      
      {/* The traveling colored point lights */}
      <pointLight 
        ref={pointCyanRef} 
        color={COLORS_THREE.cyan} 
        distance={40} 
        decay={2} 
      />
      <pointLight 
        ref={pointPurpleRef} 
        color={COLORS_THREE.purple} 
        distance={40} 
        decay={2} 
      />
      <pointLight 
        ref={pointMagentaRef} 
        color={COLORS_THREE.magenta} 
        distance={35} 
        decay={2} 
      />
    </>
  );
}