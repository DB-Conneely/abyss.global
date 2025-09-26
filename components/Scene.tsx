'use client';
import React, { useRef, useEffect, useLayoutEffect, MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls, Environment, useGLTF } from '@react-three/drei';
// import { EffectComposer, Bloom } from '@react-three/postprocessing'; // Comment out or remove this import
import * as THREE from 'three';
import gsap from 'gsap';
import Lenis from 'lenis';
import * as animations from '@/utils/animations';
interface SceneProps {
  isMobile: boolean;
  scrollY: number;
  lenis?: Lenis | null;
}
const Scene: React.FC<SceneProps> = ({ isMobile, scrollY, lenis }) => {
  // Replaced direct destructuring with selector pattern for type inference and performance
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const threeScene = useThree((state) => state.scene);
  const heroRef = useRef<THREE.Group>(null);
  const starGroupRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]); // Store materials for useFrame updates (replaces onBeforeRender)
  // Load Earth globe model (point to the .gltf file; loader handles .bin and textures)
  const { scene: earthModel } = useGLTF('/models/earth/scene.gltf');
  // Run hero open animation and auto-center/size the model
  useEffect(() => {
    if (heroRef.current && earthModel) {
      console.log('Earth model loaded:', earthModel); // Debug: Check if model loads
      // Add model to group first (before transforms)
      heroRef.current.add(earthModel);
      // Traverse and convert spec/gloss materials to PBR + apply selective tints
      earthModel.traverse((child) => {
        if (child instanceof THREE.Mesh && child.userData.gltfExtensions?.KHR_materials_pbrSpecularGlossiness) {
          const ext = child.userData.gltfExtensions.KHR_materials_pbrSpecularGlossiness;
          const material = new THREE.MeshStandardMaterial({
            map: ext.diffuseTexture ? ext.diffuseTexture : null, // Diffuse/color texture
            normalMap: ext.normalTexture ? ext.normalTexture : null, // Bump details
            emissiveMap: ext.diffuseTexture ? ext.diffuseTexture : null, // Glow sim
            emissive: new THREE.Color(ext.diffuseFactor || 0x444444).multiplyScalar(0.1), // Subtle emissive base
            roughness: 1 - (ext.glossinessFactor || 0), // Invert gloss to roughness
            metalness: ext.specularFactor ? ext.specularFactor.length > 0 ? 0.5 : 0 : 0, // Metallic from specular
            color: new THREE.Color(ext.diffuseFactor || 0xffffff), // Base color
            transparent: false, // Disable transparency to remove glaze
            opacity: 1.0,
          });
          // Selective tints (HSL for targeted shifts)
          // Water: Lift dark blues to lighter purple - lightness boost
          material.color.offsetHSL(0.75, 0.6, 0.3); // Increased sat, reduced light for more vivid sea
          // Countries: Shift to more vivid purple
          material.color.setHSL(0.78, 0.8, 0.5); // Higher sat for stronger purple on land
          // Clouds: Lavender tint
          if (child.name.includes('_1') || child.name.includes('cloud')) { // Assume cloud mesh name
            material.color.setHex(0xDDA0DD); // Lighter lavender #DDA0DD
          }
          // Glow: Brighter pink/purple aura
          material.emissive.setHex(0xFF69B4).multiplyScalar(1.2); // Brighter emissive
          child.material = material;
          console.log('Applied selective tints to:', child.name); // Debug
        } else if (child instanceof THREE.Mesh) {
          // Fallback for non-spec/gloss meshes (this triggers for your model)
          if (child.material && child.material instanceof THREE.MeshStandardMaterial) {
            const originalMaterial = child.material;
            // Extract original textures for PBR continuity
            const baseColorMap = (originalMaterial as any).map || null; // Albedo texture
            const normalMap = originalMaterial.normalMap || null;
            const roughnessMap = (originalMaterial as any).roughnessMap || null;
            const emissiveMap = originalMaterial.emissiveMap || null;
            // Create a new material with onBeforeCompile hook for ocean lift
            const material = new THREE.MeshStandardMaterial({
              map: baseColorMap,
              normalMap: normalMap,
              normalScale: originalMaterial.normalScale || new THREE.Vector2(1, 1),
              roughnessMap: roughnessMap,
              metalness: originalMaterial.metalness || 0,
              roughness: originalMaterial.roughness || 1,
              emissiveMap: emissiveMap,
              emissive: new THREE.Color(0xFF69B4).multiplyScalar(1.2), // Brighter pink/purple lights
              transparent: false, // Disable transparency
              opacity: 1.0,
            });
            // Lighter global purple tint
            material.color.setHex(0xAB47BC); // Lighter pink/purple #AB47BC
            // Custom shader injection: Lift dark oceans to lighter purple
            material.onBeforeCompile = (shader) => {
              // Define custom uniforms
              shader.uniforms.tPurpleBase = { value: new THREE.Color(0x4A148C) }; // Lighter dark purple for oceans #4A148C
              shader.uniforms.uOceanThreshold = { value: 0.2 }; // Higher threshold to affect more areas subtly
              shader.uniforms.uOceanLift = { value: 0.3 }; // Lower lift for less dominant purple in sea
              // Inject uniform declarations
              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `#include <common>
                uniform vec3 tPurpleBase;
                uniform float uOceanThreshold;
                uniform float uOceanLift;
                `
              );
              // Inject the ocean lift logic
              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <map_fragment>',
                `
                #include <map_fragment>
                // Custom ocean lift: Detect low-lum, blend to lighter purple
                float lum = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114)); // Standard luminance
                if (lum < uOceanThreshold) {
                  vec3 oceanLightPurple = tPurpleBase;
                  diffuseColor.rgb = mix(diffuseColor.rgb, oceanLightPurple, uOceanLift);
                }
                `
              );
              // Store shader reference for uniform updates
              material.userData.shader = shader;
            };
            // Store material for useFrame updates
            materialsRef.current.push(material);
            child.material = material;
            console.log('Applied ocean-lift shader to:', child.name); // Debug
          }
        }
      });
      // Removed inner nebula to simplify and avoid any contribution to glaze
      // Apply transforms on the model: No flip for new upright model
      earthModel.rotation.x = 0; // Reset—no upside-down flip needed
      earthModel.rotation.y = 0; // Lock yaw to prevent side-veering
      // Scale the model (8 units: 80% for balanced fit)
      const boxPreScale = new THREE.Box3().setFromObject(earthModel);
      const sizePreScale = new THREE.Vector3();
      boxPreScale.getSize(sizePreScale);
      const desiredDiameter = 8;
      const scaleFactor = desiredDiameter / Math.max(sizePreScale.x, sizePreScale.y, sizePreScale.z);
      earthModel.scale.multiplyScalar(scaleFactor);
      // Force update matrices after all transforms for rock-solid bounding
      earthModel.updateMatrixWorld(true);
      // Compute final bounding box on the full group (bakes everything)
      const finalBox = new THREE.Box3().setFromObject(heroRef.current);
      const finalCenter = new THREE.Vector3();
      finalBox.getCenter(finalCenter);
      // Center the entire group at origin—negate to kill any drift
      heroRef.current.position.copy(finalCenter).negate();
      // No extra offsets—equator dead center behind text
    }
    animations.heroOpen(heroRef.current, null, camera as THREE.PerspectiveCamera);
    // Camera: Straight-on, no tweaks
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);
  }, [camera, earthModel]);
  useLayoutEffect(() => {}, []); // Empty for now
  useFrame((state, delta) => {
    if (starGroupRef.current) starGroupRef.current.rotation.y += delta * 0.05; // Rotation for stars
    if (heroRef.current) {
      heroRef.current.rotation.y += delta * 0.05; // Synced rotation with stars
    }
    // Update custom uniforms for ocean-lift materials (replaces onBeforeRender)
    materialsRef.current.forEach((material) => {
      if (material.userData.shader) {
        const uniforms = material.userData.shader.uniforms;
        uniforms.tPurpleBase.value.setHex(0x4A148C); // Lighter
        uniforms.uOceanThreshold.value = 0.2;
        uniforms.uOceanLift.value = 0.3;
      }
    });
    // Removed scroll-based camera lerps to keep globe fixed/centered with no movement on scroll
  });
  const effects = null; // Remove Bloom for consistent darker shade
  return (
    <>
      <color attach="background" args={['#000011']} /> {/* Slight navy tint to ease pure black */}
      <ambientLight intensity={0.8} color="#AB47BC" /> {/* Brighter ambient for lighter fill */}
      <pointLight position={[10, 10, 10]} intensity={1.8} color="#DDA0DD" />
      <directionalLight position={[0, 10, 5]} intensity={1.2} color="#ffffff" castShadow={false} /> {/* Stronger key light for pop */}
      <Environment preset="sunset" /> {/* Sunset for brighter dusk */}
      <group ref={heroRef} position={[0, 0, 0]} /> {/* Starts at origin; auto-adjusted in useEffect */}
      <group ref={starGroupRef}>
        <Stars radius={50} depth={30} count={2000} factor={4} saturation={0} fade />
      </group>
      {/* Commented out OrbitControls to prevent any auto-rotation or interference with centering */}
      {/* {!isMobile && <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 3} maxPolarAngle={2 * Math.PI / 3} autoRotate autoRotateSpeed={0.5} />} */}
      {effects}
    </>
  );
};
export default Scene;