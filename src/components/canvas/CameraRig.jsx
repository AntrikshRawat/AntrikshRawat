import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../ScrollManager';
import {
  PIPELINE_CURVE,
  SECTION_POSITIONS,
  CAMERA_Y_OFFSET,
  TOTAL_SECTIONS,
  remapProgressWithDwell,
} from '../../utils/constants';

export default function CameraRig() {
  // Initial values match the first curve point + offset
  const targetPos = useRef(new THREE.Vector3(0, CAMERA_Y_OFFSET, 40));
  const targetLook = useRef(new THREE.Vector3(
    SECTION_POSITIONS[0].x,
    SECTION_POSITIONS[0].y,
    SECTION_POSITIONS[0].z
  ));
  const currentLook = useRef(new THREE.Vector3(
    SECTION_POSITIONS[0].x,
    SECTION_POSITIONS[0].y,
    SECTION_POSITIONS[0].z
  ));

  useFrame((state) => {
    const { camera } = state;

    // Read progress directly from module store (not React context)
    const progress = scrollStore.getProgress();

    // ── Remap progress with dwell zones ──
    // The sigmoid creates plateaus so the camera PAUSES at each section
    const remappedT = remapProgressWithDwell(progress);

    // ── Camera position: follow the pipeline curve from ABOVE ──
    const curvePoint = PIPELINE_CURVE.getPoint(remappedT);

    targetPos.current.set(
      curvePoint.x,
      curvePoint.y + CAMERA_Y_OFFSET,
      curvePoint.z
    );

    // ── Camera lookAt: interpolate between section billboard positions ──
    // Uses remapped progress so the lookAt also dwells on each section
    const totalSegments = TOTAL_SECTIONS - 1;
    const rawIndex = remappedT * totalSegments;
    const index = Math.floor(rawIndex);
    const fract = rawIndex - index;

    // Smooth easing (smoothstep)
    const eased = fract * fract * (3 - 2 * fract);

    const i0 = Math.min(index, totalSegments);
    const i1 = Math.min(index + 1, totalSegments);

    const s0 = SECTION_POSITIONS[i0];
    const s1 = SECTION_POSITIONS[i1];

    targetLook.current.set(
      THREE.MathUtils.lerp(s0.x, s1.x, eased),
      THREE.MathUtils.lerp(s0.y, s1.y, eased),
      THREE.MathUtils.lerp(s0.z, s1.z, eased)
    );

    // Smoothly follow target (damped)
    camera.position.lerp(targetPos.current, 0.08);
    currentLook.current.lerp(targetLook.current, 0.08);
    camera.lookAt(currentLook.current);
  });

  return null;
}
