import React, { useMemo } from 'react';
import * as THREE from 'three';
import { PIPELINE_CURVE } from '../../utils/constants';



export default function GlobalPipeline() {
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(PIPELINE_CURVE, 200, 1.5, 12, false);
  }, []);

  const wireframeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(PIPELINE_CURVE, 200, 4, 8, false);
  }, []);

  return (
    <group>
      {/* Inner Glowing Tube */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.15}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Primary Structural Wireframe */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Outer Decorative Cage */}
      <mesh geometry={wireframeGeometry}>
        <meshStandardMaterial
          color="#b44aff"
          emissive="#b44aff"
          emissiveIntensity={0.2}
          wireframe
          transparent
          opacity={0.05}
        />
      </mesh>
    </group>
  );
}
