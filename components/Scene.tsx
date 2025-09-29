// components/Scene.tsx (Full file with spinning custom stars)
"use client";
import React, { useRef, useEffect, useLayoutEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Stars, useGLTF } from "@react-three/drei"; // Stars back
import * as THREE from "three";
import * as animations from "@/utils/animations";
import Starfield from "@/components/Starfield"; // Keep custom

// The empty SceneProps interface has been removed.
const Scene: React.FC = () => {
  const camera = useThree((state) => state.camera);
  const heroRef = useRef<THREE.Group>(null);
  const starGroupRef = useRef<THREE.Group>(null); // For rotating both star layers
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const { scene: earthModel } = useGLTF("/models/earth/scene.gltf");
  useEffect(() => {
    if (heroRef.current && earthModel) {
      heroRef.current.add(earthModel);
      earthModel.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.userData.gltfExtensions?.KHR_materials_pbrSpecularGlossiness
        ) {
          const ext =
            child.userData.gltfExtensions.KHR_materials_pbrSpecularGlossiness;
          const material = new THREE.MeshStandardMaterial({
            map: ext.diffuseTexture ? ext.diffuseTexture : null,
            normalMap: ext.normalTexture ? ext.normalTexture : null,
            emissiveMap: ext.diffuseTexture ? ext.diffuseTexture : null,
            emissive: new THREE.Color(
              ext.diffuseFactor || 0x444444,
            ).multiplyScalar(0.1),
            roughness: 1 - (ext.glossinessFactor || 0),
            metalness: ext.specularFactor
              ? ext.specularFactor.length > 0
                ? 0.5
                : 0
              : 0,
            color: new THREE.Color(ext.diffuseFactor || 0xffffff),
            transparent: false,
            opacity: 1.0,
          });
          // Selective tints (HSL for targeted shifts)
          // Water: Lift dark blues to lighter purple - lightness boost
          material.color.offsetHSL(0.75, 0.6, 0.3); // Increased sat, reduced light for more vivid sea
          // Countries: Shift to more vivid purple
          material.color.setHSL(0.78, 0.8, 0.5); // Higher sat for stronger purple on land
          // Clouds: Lavender tint
          if (child.name.includes("_1") || child.name.includes("cloud")) {
            // Assume cloud mesh name
            material.color.setHex(0xdda0dd); // Lighter lavender #DDA0DD
          }
          // Glow: Brighter pink/purple aura
          material.emissive.setHex(0xff69b4).multiplyScalar(1.2); // Brighter emissive
          child.material = material;
        } else if (child instanceof THREE.Mesh) {
          // Fallback for non-spec/gloss meshes (this triggers for your model)
          if (
            child.material &&
            child.material instanceof THREE.MeshStandardMaterial
          ) {
            const originalMaterial = child.material;
            // Extract original textures for PBR continuity
            const baseColorMap = originalMaterial.map || null; // Albedo texture (UPDATED: Direct access, no any cast)
            const normalMap = originalMaterial.normalMap || null;
            const roughnessMap = originalMaterial.roughnessMap || null; // UPDATED: Direct access, no any cast
            const emissiveMap = originalMaterial.emissiveMap || null;
            // Create a new material with onBeforeCompile hook for ocean lift
            const material = new THREE.MeshStandardMaterial({
              map: baseColorMap,
              normalMap: normalMap,
              normalScale:
                originalMaterial.normalScale || new THREE.Vector2(1, 1),
              roughnessMap: roughnessMap,
              metalness: originalMaterial.metalness || 0,
              roughness: originalMaterial.roughness || 1,
              emissiveMap: emissiveMap,
              emissive: new THREE.Color(0xff69b4).multiplyScalar(1.2), // Brighter pink/purple lights
              transparent: false, // Disable transparency
              opacity: 1.0,
            });
            // Lighter global purple tint
            material.color.setHex(0xab47bc); // Lighter pink/purple #AB47BC
            // Custom shader injection: Lift dark oceans to lighter purple
            material.onBeforeCompile = (shader) => {
              // Define custom uniforms
              shader.uniforms.tPurpleBase = {
                value: new THREE.Color(0x4a148c),
              }; // Lighter dark purple for oceans #4A148C
              shader.uniforms.uOceanThreshold = { value: 0.2 }; // Higher threshold to affect more areas subtly
              shader.uniforms.uOceanLift = { value: 0.3 }; // Lower lift for less dominant purple in sea
              // Inject uniform declarations
              shader.fragmentShader = shader.fragmentShader.replace(
                "#include <common>",
                `#include <common>
                uniform vec3 tPurpleBase;
                uniform float uOceanThreshold;
                uniform float uOceanLift;
                `,
              );
              // Inject the ocean lift logic
              shader.fragmentShader = shader.fragmentShader.replace(
                "#include <map_fragment>",
                `
                #include <map_fragment>
                // Custom ocean lift: Detect low-lum, blend to lighter purple
                float lum = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114)); // Standard luminance
                if (lum < uOceanThreshold) {
                  vec3 oceanLightPurple = tPurpleBase;
                  diffuseColor.rgb = mix(diffuseColor.rgb, oceanLightPurple, uOceanLift);
                }
                `,
              );
              // Store shader reference for uniform updates
              material.userData.shader = shader;
            };
            // Store material for useFrame updates
            materialsRef.current.push(material);
            child.material = material;
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
      const scaleFactor =
        desiredDiameter /
        Math.max(sizePreScale.x, sizePreScale.y, sizePreScale.z);
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
    animations.heroOpen(
      heroRef.current,
      null,
      camera as THREE.PerspectiveCamera,
    );
    // Camera: Straight-on, no tweaks
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);
  }, [camera, earthModel]);
  useLayoutEffect(() => {}, []); // Empty for now
  useFrame((state, delta) => {
    if (starGroupRef.current) starGroupRef.current.rotation.y += delta * 0.05; // Rotation for both star layers
    if (heroRef.current) {
      heroRef.current.rotation.y += delta * 0.05; // Synced rotation with stars
    }
    // Update custom uniforms for ocean-lift materials (replaces onBeforeRender)
    materialsRef.current.forEach((material) => {
      if (material.userData.shader) {
        const uniforms = material.userData.shader.uniforms;
        uniforms.tPurpleBase.value.setHex(0x4a148c); // Lighter
        uniforms.uOceanThreshold.value = 0.2;
        uniforms.uOceanLift.value = 0.3;
      }
    });
    // Removed scroll-based camera lerps to keep globe fixed/centered with no movement on scroll
  });
  const effects = null; // Remove Bloom for consistent darker shade
  return (
    <>
      <color attach="background" args={["#000011"]} />{" "}
      {/* Slight navy tint to ease pure black */}
      <ambientLight intensity={0.8} color="#AB47BC" />{" "}
      {/* Brighter ambient for lighter fill */}
      <pointLight position={[10, 10, 10]} intensity={1.8} color="#DDA0DD" />
      <directionalLight
        position={[0, 10, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow={false}
      />{" "}
      {/* Stronger key light for pop */}
      <Environment preset="sunset" /> {/* Sunset for brighter dusk */}
      <group ref={heroRef} position={[0, 0, 0]} />{" "}
      {/* Starts at origin; auto-adjusted in useEffect */}
      <group ref={starGroupRef}>
        <Stars
          radius={50}
          depth={30}
          count={2000}
          factor={4}
          saturation={0}
          fade
        />{" "}
        {/* Original background */}
        <Starfield /> {/* Custom foreground with tint */}
      </group>
      {/* Commented out OrbitControls to prevent any auto-rotation or interference with centering */}
      {/* {!isMobile && <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 3} maxPolarAngle={2 * Math.PI / 3} autoRotate autoRotateSpeed={0.5} />} */}
      {effects}
    </>
  );
};
export default Scene;
