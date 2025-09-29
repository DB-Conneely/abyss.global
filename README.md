# Spacey Landing Page

An interactive single-page landing page with a "floating through the universe" theme, featuring a 3D futuristic purple energy core with orbiting asteroid fragments that "opens up" the page on load. Built with Next.js, React Three Fiber, GSAP, and Lenis for smooth scrolling and animations. Focuses on high-quality visuals with performance optimizations.

## Setup

1. Ensure Node.js >=18 is installed.
2. Clone the repository and navigate to the project directory.
3. Install dependencies:

```bash
  npm install
```

This will pull in packages like Next.js, @react-three/fiber, GSAP, and Lenis as defined in `package.json`.

## Running the Project

- For development mode (with hot reloading):

```bash
  npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- For production build:

```bash
  npm run build
```

Then start the server:

```bash
  npm run start
```

- Lint the code:

```bash
  npm run lint
```

- Format the code:

```bash
  npm run format
```

## Asset Swaps

Assets are stored in `/public` for static serving:

- **3D Models**: Place .glb files (with Draco compression) in `/public/models/`. Example: Replace `hero-core.glb` with your custom model.
- Update the import in `/components/Scene.tsx`: Change `useGLTF('/models/hero-core.glb')` to your new path.

- **Textures**: Use KTX2 format in `/public/textures/`. Example: Swap `nebula_ktx2.ktx2`.
- Update in `Scene.tsx` via `useTexture`.

- **HDRIs**: For environments, place .hdr files in `/public/hdr/`. Example: `space_env.hdr`.
- Update in `Scene.tsx` Environment component.

When swapping, ensure formats follow the asset pipeline: .glb with tangents/UVs/LODs, compressed textures under 2048x2048.

## Customization

- **Color Palette**: Edit tokens in `/styles/globals.css` (e.g., `--primary-purple: #6A1B9A;`). These apply globally, including to shaders.

- **Text/Content**: Replace placeholders in components:
- `/components/Hero.tsx`: Update `<h1>Explore the Universe</h1>` and subtitle.
- `/components/Features.tsx`: Change feature blocks (e.g., "Feature 1: Nebula Views").
- `/components/CTA.tsx`: Modify "Get Started" button text/action.
- Add real copy or links as needed.

- **Animations/Shaders**: Tweak GSAP timelines in `/utils/animations.ts` (e.g., heroOpen duration). Adjust shader uniforms in `/utils/shaders.ts` for effects like nebula noiseScale.

- **Mobile Fallbacks**: Test on devices; edit `Scene.tsx` for more reductions (e.g., particle count).

- **Extensions**: Add physics with `@react-three/rapier` (install and import in `Scene.tsx` for heavier asteroid sim).

## Troubleshooting

- **Performance Issues**: If FPS drops, reduce asteroidCount in `Scene.tsx` or disable postprocessing on mobile. Use Chrome DevTools profiler.
- **Asset Loading Errors**: Ensure files are in `/public` and paths match imports. Check console for 404s.
- **Scroll Jank**: Verify Lenis setup in `page.tsx`; fallback to native if needed.
- **Shader Compilation Fails**: Confirm GLSL syntax; test in isolation.
- **Build Errors**: Run `npm run lint` and fix TypeScript issues.

For more details, refer to the project plan or contact the developer.
