// components/BlogScene.tsx (Updated - Increase scale to 4 for larger/closer feel; ensure centering)
'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface BlogSceneProps {
  isMobile: boolean;
}

const BlogScene: React.FC<BlogSceneProps> = ({ isMobile }) => {
  const groupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>(null); // For OrbitControls
  const { scene: spaceBoi } = useGLTF('/models/space-boi.glb');

  // Exact centering/tint from Earth logic (adapted - dead center)
  useEffect(() => {
    if (spaceBoi && groupRef.current) {
      spaceBoi.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.color.setHex(0xAB47BC); // Purple tint
        }
      });
      spaceBoi.rotation.x = 0;
      spaceBoi.rotation.y = 0; // Face front
      const boxPreScale = new THREE.Box3().setFromObject(spaceBoi);
      const sizePreScale = new THREE.Vector3();
      boxPreScale.getSize(sizePreScale);
      const desiredDiameter = 8; // Match Earth
      const scaleFactor = desiredDiameter / Math.max(sizePreScale.x, sizePreScale.y, sizePreScale.z);
      spaceBoi.scale.multiplyScalar(scaleFactor * 0.5); // Increased effective scale to 4 (scaleFactor ~8, *0.5=4; adjust 0.4-0.6 for size)
      spaceBoi.updateMatrixWorld(true);
      const finalBox = new THREE.Box3().setFromObject(spaceBoi);
      const finalCenter = new THREE.Vector3();
      finalBox.getCenter(finalCenter);
      spaceBoi.position.copy(finalCenter).negate();
      groupRef.current.add(spaceBoi);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    }
  }, [spaceBoi]);

  // No model rotation in useFrame (still model)
  useFrame(() => {
    // Controls handle camera pan
  });

  return (
    <>
      <color attach="background" args={['#000011']} />
      <ambientLight intensity={0.8} color="#AB47BC" />
      <pointLight position={[10, 10, 10]} intensity={1.8} color="#DDA0DD" />
      <directionalLight position={[0, 10, 5]} intensity={1.2} color="#ffffff" />
      <group ref={groupRef} />
      {!isMobile && (
        <OrbitControls 
          ref={controlsRef}
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={2 * Math.PI / 3}
          autoRotate={true}
          autoRotateSpeed={2} // Keep quicker pan
        />
      )}
    </>
  );
};

export default BlogScene;