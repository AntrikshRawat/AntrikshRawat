import { useThree, useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';

export default function ResponsiveCamera() {
  const { camera, size } = useThree();

  useFrame(() => {
    // Calculate the current screen aspect ratio
    const aspect = size.width / size.height;
    
    // If aspect is less than 1 (portrait/mobile), widen the FOV to 85.
    // If it's a desktop (landscape), keep your baseline FOV of 60.
    const targetFov = aspect < 1 ? 85 : 60;

    // Smoothly interpolate the FOV. This prevents jarring snaps if 
    // a desktop user resizes their browser window.
    camera.fov = MathUtils.lerp(camera.fov, targetFov, 0.1);
    camera.updateProjectionMatrix();
  });

  return null;
}