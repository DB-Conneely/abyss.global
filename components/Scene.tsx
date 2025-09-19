'use client';
import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
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
  const { camera, gl, scene: threeScene } = useThree();
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
          });
          // Selective tints (HSL for targeted shifts)
          // Water: Lift dark blues to #321642 (dark purple) - lightness boost on low values
          material.color.offsetHSL(0, 0, 0.3); // Neutral hue/sat, +30% lightness for darks
          // Countries: Shift pinks to #622c83 (deep purple) - hue to violet, sat down
          material.color.setHSL(0.8, 0.6, 0.4); // Hue 0.8 (purple), sat 60%, light 40%
          // Clouds: If high-bright mesh (e.g., Earth_0_1), tint to #9a4bc3 (lavender)
          if (child.name.includes('_1') || child.name.includes('cloud')) { // Assume cloud mesh name
            material.color.setHex(0x9a4bc3); // #9a4bc3 direct
          }
          // Glow: Subtle pink/purple aura (#FF69B4) for lights
          material.emissive.setHex(0xFF69B4).multiplyScalar(0.8);
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
              emissive: new THREE.Color(0xFF69B4).multiplyScalar(0.8), // Pink/purple lights (#FF69B4)
            });
            
            // Subtle global purple tint (the "slight hue" you liked before)
            material.color.setHex(0x9C27B0);
            
            // Custom shader injection: Lift dark oceans to dark purple
            material.onBeforeCompile = (shader) => {
              // Define custom uniforms
              shader.uniforms.tPurpleBase = { value: new THREE.Color(0x2C0A2A) }; // Dark purple baseline for oceans (#2C0A2A)
              shader.uniforms.uOceanThreshold = { value: 0.15 }; // Luminance cutoff for "dark" (tweak 0.1-0.2)
              shader.uniforms.uOceanLift = { value: 0.6 }; // Blend strength (0.4-0.8 for subtlety)
              
              // Inject uniform declarations at the top of fragment shader (after common includes)
              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `#include <common>

                uniform vec3 tPurpleBase;
                uniform float uOceanThreshold;
                uniform float uOceanLift;
                `
              );
              
              // Inject the ocean lift logic after base color sampling
              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <map_fragment>',
                `
                #include <map_fragment>
                
                // Custom ocean lift: Detect low-lum, blend to dark purple
                float lum = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114)); // Standard luminance
                if (lum < uOceanThreshold) {
                  vec3 oceanDarkPurple = tPurpleBase;
                  diffuseColor.rgb = mix(diffuseColor.rgb, oceanDarkPurple, uOceanLift);
                }
                `
              );
              
              // Store shader reference for uniform updates
              material.userData.shader = shader;
            };
            
            // Store material for useFrame updates (replaces onBeforeRender)
            materialsRef.current.push(material);
            
            child.material = material;
            console.log('Applied ocean-lift shader to:', child.name); // Debug
          }
        }
      });
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
  // Mouse tilt (commented out to avoid any tilt/angle issues)
  // useEffect(() => {
  // const handleMouse = (e: MouseEvent) => {
  // if (isMobile) return;
  // const x = (e.clientX / window.innerWidth - 0.5) * 0.1;
  // const y = (e.clientY / window.innerHeight - 0.5) * 0.1;
  // gsap.to(camera.rotation, { x: -y, y: x, duration: 1.5 });
  // };
  // window.addEventListener('mousemove', handleMouse);
  // return () => window.removeEventListener('mousemove', handleMouse);
  // }, [camera, isMobile]);
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
        uniforms.tPurpleBase.value.setHex(0x2C0A2A); // Fixed, but could animate
        uniforms.uOceanThreshold.value = 0.15;
        uniforms.uOceanLift.value = 0.6;
      }
    });
    // Removed scroll-based camera lerps to keep globe fixed/centered with no movement on scroll
  });
  const effects = !isMobile ? (
    <EffectComposer>
      <Bloom luminanceThreshold={0.05} luminanceSmoothing={0.9} height={400} />
    </EffectComposer>
  ) : null;
  return (
    <>
      <color attach="background" args={['#000011']} /> {/* Slight navy tint to ease pure black */}
      <ambientLight intensity={0.6} color="#6A1B9A" /> {/* Brighter ambient for even fill */}
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#9C27B0" />
      <directionalLight position={[0, 10, 5]} intensity={1.0} color="#ffffff" castShadow={false} /> {/* Added: Sun-like key light for Earth day pop */}
      <Environment preset="sunset" /> {/* Swapped to sunset: Brighter cosmic dusk, less "night" */}
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