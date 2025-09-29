// components/Starfield.tsx (Full with renamed attribute)
"use client";

import React, { useRef, useMemo } from "react";
import { useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import { CustomStarfieldMaterial } from "@/utils/shaders";

extend({ CustomStarfieldMaterial });

interface CustomStarfieldMaterialProps {
  ref?: React.Ref<CustomStarfieldMaterial>;
  attach?: string;
  pointSize?: number;
  [key: string]: unknown; // <-- Changed 'any' to 'unknown'
}

const Starfield: React.FC = () => {
  const materialRef = useRef<CustomStarfieldMaterial>(null);

  // Generate positions, colors, and phase offsets
  const [positions, colors, phases] = useMemo(() => {
    const pos = new Float32Array(5000 * 3);
    const col = new Float32Array(5000 * 3);
    const pha = new Float32Array(5000);
    for (let i = 0; i < 5000; i++) {
      const r = 50 + Math.random() * 50;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      pos.set([x, y, z], i * 3);

      // Random purple/white color (50/50)
      const isPurple = Math.random() > 0.5;
      col.set(isPurple ? [0.4157, 0.1059, 0.6902] : [1.0, 1.0, 1.0], i * 3); // Purple or white

      // Random phase offset for independent flicker
      pha[i] = Math.random() * Math.PI * 2; // 0 to 2PI
    }
    return [
      new THREE.BufferAttribute(pos, 3),
      new THREE.BufferAttribute(col, 3),
      new THREE.BufferAttribute(pha, 1),
    ];
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute attach="attributes-position" {...positions} />
        <bufferAttribute attach="attributes-starColor" {...colors} />{" "}
        {/* Renamed to avoid conflict */}
        <bufferAttribute attach="attributes-phase" {...phases} />
      </bufferGeometry>
      <customStarfieldMaterial
        ref={materialRef}
        attach="material"
        pointSize={1.5}
      />
    </points>
  );
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // <-- The comment now correctly targets this line
    interface IntrinsicElements {
      customStarfieldMaterial: CustomStarfieldMaterialProps;
    }
  }
}

export default Starfield;
