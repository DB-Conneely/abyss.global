// components/BlogScene.tsx (Updated - Add cleanup on unmount to prevent context loss/blank on remount)
"use client";
import React, { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls as OrbitControlsComponent, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls } from 'three-stdlib'; // UPDATED: Correct type import from three-stdlib

interface BlogSceneProps {
  isMobile: boolean;
}
const BlogScene: React.FC<BlogSceneProps> = ({ isMobile }) => {
  const groupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<OrbitControls | null>(null); // Use imported instance type
  const { scene: spaceBoi } = useGLTF("/models/space-boi.glb");
  const { gl } = useThree(); // Access renderer for forceContextLoss/cleanup
  // Center, scale, tint purple (no rotation here—model still)
  useEffect(() => {
    if (spaceBoi && groupRef.current) {
      spaceBoi.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.color.setHex(0xab47bc); // Purple tint
        }
      });
      spaceBoi.rotation.x = 0;
      spaceBoi.rotation.y = 0;
      const boxPreScale = new THREE.Box3().setFromObject(spaceBoi);
      const sizePreScale = new THREE.Vector3();
      boxPreScale.getSize(sizePreScale);
      const desiredDiameter = 8;
      const scaleFactor =
        desiredDiameter /
        Math.max(sizePreScale.x, sizePreScale.y, sizePreScale.z);
      spaceBoi.scale.multiplyScalar(scaleFactor * 0.5); // Keep 4 effective
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
    // Cleanup on unmount: Dispose resources to prevent context loss on remount/switch
    return () => {
      if (spaceBoi) {
        spaceBoi.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
      }
      if (gl) {
        gl.forceContextLoss(); // Reset WebGL state to avoid "too many contexts" on page switch
      }
    };
  }, [spaceBoi, gl]);
  // No model rotation in useFrame (still model)
  useFrame(() => {
    // Controls handle camera pan
  });
  return (
    <>
      <color attach="background" args={["#000011"]} />
      <ambientLight intensity={0.8} color="#AB47BC" />
      <pointLight position={[10, 10, 10]} intensity={1.8} color="#DDA0DD" />
      <directionalLight position={[0, 10, 5]} intensity={1.2} color="#ffffff" />
      <group ref={groupRef} />
      {!isMobile && (
        <OrbitControlsComponent
          ref={controlsRef}
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(2 * Math.PI) / 3}
          autoRotate={true}
          autoRotateSpeed={2}
        />
      )}
    </>
  );
};
export default BlogScene;