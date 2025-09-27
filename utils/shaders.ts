import * as THREE from 'three';

// Improved 3D noise (classic value noise for smoother FBM)
const noiseGLSL = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float noise(vec3 p) {
    vec3 a = floor(p + 0.5);
    vec3 s = a - dot(p - 0.5, vec3(1.0));
    vec3 x = p - a + 0.5;
    vec3 u = x * x * (3.0 - 2.0 * x);
    return mix(mix(mix(dot(s - 1.0, x - 1.0) + 1.0, dot(s, x), u.x), mix(dot(s + 1.0 - 1.0, x + 1.0 - 1.0) + 1.0, dot(s + 1.0, x + 1.0), u.x), u.y), mix(mix(dot(s - 1.0 + 1.0, x - 1.0 + 1.0) + 1.0, dot(s + 1.0 - 1.0, x + 1.0 - 1.0) + 1.0, u.x), mix(dot(s + 1.0, x + 1.0), dot(s + 1.0 + 1.0, x + 1.0 + 1.0) + 1.0, u.x), u.y), u.z);
  }

  float fbm(vec3 p, int octaves, float scale) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < octaves; i++) {
      value += amplitude * noise(p * frequency);
      p *= 2.0;
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value * scale;
  }
`;

// Nebula: Tuned density, purple gradient enforcement
export class NebulaMaterial extends THREE.ShaderMaterial {
  constructor(params: {
    time?: number;
    resolution: THREE.Vector2;
    cameraPos: THREE.Vector3;
    noiseScale: number;
    colorPalette: number[]; // Flat RGB array for GLSL
  }) {
    const palette = new Float32Array(params.colorPalette); // [r1,g1,b1, r2,g2,b2, r3,g3,b3]
    super({
      uniforms: {
        time: { value: params.time ?? 0 },
        resolution: { value: params.resolution },
        cameraPos: { value: params.cameraPos },
        noiseScale: { value: params.noiseScale },
        colorPalette: { value: palette },
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float time;
        uniform vec3 cameraPos;
        uniform float noiseScale;

        ${noiseGLSL}

        void main() {
          vUv = uv;
          vec3 pos = position;
          float disp = fbm(pos * 0.1 + cameraPos * 0.01 + time * 0.05, 3, noiseScale); // Reduced octaves, slower anim
          pos += normal * disp * 0.3; // Subtle displacement
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float time;
        uniform vec2 resolution;
        uniform vec3 cameraPos;
        uniform float noiseScale;
        uniform vec3 colorPalette[3]; // Access as array

        ${noiseGLSL}

        void main() {
          vec2 uv = (vUv - 0.5) * 2.0 + 0.5; // Normalized
          vec3 coord = vec3(uv * 3.0, time * 0.005); // Slower, wider
          float density = fbm(coord + cameraPos * 0.1, 3, noiseScale) * 1.2; // Boost density
          vec3 color = mix(colorPalette[0], colorPalette[1], smoothstep(0.0, 1.0, density));
          color = mix(color, colorPalette[2], smoothstep(0.5, 1.0, density)); // Purple undertone
          float alpha = clamp(density, 0.0, 0.9); // Higher alpha
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }
}

// Starfield: Normalized flicker, size attenuation
export class CustomStarfieldMaterial extends THREE.ShaderMaterial { // Renamed to avoid conflicts
  constructor(params: { time?: number; pointSize?: number } = {}) { // Optional params with defaults
    super({
      uniforms: {
        time: { value: params.time ?? 0 },
        pointSize: { value: params.pointSize ?? 1.0 },
      },
      vertexShader: `
        uniform float time;
        uniform float pointSize;
        varying float vIntensity;
        attribute vec3 starColor; // Per-star color attribute
        varying vec3 vStarColor; // Pass to fragment
        attribute float phase; // Per-star phase offset
        varying float vPhase; // NEW: Varying for fragment

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = pointSize * (300.0 / -mvPosition.z); // Attenuation
          gl_Position = projectionMatrix * mvPosition;
          float normPos = length(position) / 200.0; // Normalize for consistent flicker
          vIntensity = sin(time * 2.0 + normPos * 10.0 + phase) * 0.5 + 0.5; // Add phase for random timing
          vStarColor = starColor; // Pass color
          vPhase = phase; // NEW: Pass phase to fragment
        }
      `,
      fragmentShader: `
        varying float vIntensity;
        uniform float time;
        varying vec3 vStarColor; // Received per-star color
        varying float vPhase; // NEW: Received phase

        ${noiseGLSL} // Include noise for random variation

        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float dist = length(uv);
          if (dist > 0.5) discard;
          float randomNoise = noise(vec3(uv * 10.0, time * 0.1 + vPhase)); // Slow time, add vPhase for per-star random
          float glowTrigger = step(0.99, randomNoise); // UPDATED: High threshold 0.99 for rare (1-2 stars) activation
          float glowBoost = glowTrigger * smoothstep(1.0, 0.99, randomNoise) * 1.5; // Smooth ramp for gentle brighten, *1.5 max
          float alpha = (1.0 - dist * 2.0) + glowBoost * 0.5; // UPDATED: Base alpha + glow extend (illusion of size/glow)
          alpha = clamp(alpha, 0.0, 1.0); // Cap
          float flicker = vIntensity * 0.2 + 0.9; // Subtle base twinkle
          vec3 color = vStarColor * (flicker + glowBoost);
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true, // Enable for per-vertex colors
    });
  }
}

// Soft Particle: Real depth from composer
export class SoftParticleMaterial extends THREE.ShaderMaterial {
  constructor(params: { depthTexture: THREE.Texture; softness?: number }) {
    super({
      uniforms: {
        time: { value: 0 },
        cameraPos: { value: new THREE.Vector3() },
        depthTexture: { value: params.depthTexture },
        softness: { value: params.softness ?? 0.1 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float vDepth;

        void main() {
          vUv = uv;
          vec3 pos = position;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vPosition = pos;
          vDepth = -(mvPosition.z / mvPosition.w);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = 4.0; // Fixed size
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float vDepth;
        uniform sampler2D depthTexture;
        uniform vec3 cameraPos;
        uniform float softness;

        void main() {
          vec2 screenUv = (gl_FragCoord.xy / resolution.xy);
          float sceneDepth = texture2D(depthTexture, screenUv).r;
          float diff = sceneDepth - vDepth;
          float alpha = smoothstep(0.0, softness, diff) * (1.0 - length(gl_PointCoord - 0.5) * 2.0);
          if (alpha < 0.01) discard;
          vec3 color = vec3(0.6118, 0.1529, 0.6902) * (sin(time * 5.0) * 0.5 + 0.5); // Pulsing purple
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }
}