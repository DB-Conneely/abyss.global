# Abyss Global

## Description
An interactive 3D landing page with a space theme, built as a personal portfolio to showcase development projects, a blog, and contact functionality. The site features immersive 3D visuals using React Three Fiber, smooth scrolling with Lenis, and backend integration with Supabase for dynamic blog posts and EmailJS for form submissions. This project demonstrates full-stack capabilities, AI integration in workflows, and modern web engineering.

The site is currently in final preparation for deployment via Vercel. It has 0 linted errors (via ESLint with strict Next.js config), is fully formatted with Prettier, and has been stress-tested locally for performance, responsiveness, and functionality.

## Features
- **Preloader**: Custom loader with glowing logo and text for a smooth initial load.
- **3D Scene**: Rotating Earth model with purple tints, custom-written shaders for starfield effects (flicker, glow, noise-based variation), and auras for a cosmic background.
- **Sections**:
  - Hero: Introductory glow text.
  - About: Personal background and development philosophy, with a "Check the Blog!" button.
  - Projects: Three showcased projects with images, embedded YouTube demos (for applicable ones), descriptions, and links.
  - Contact: Form with validation, EmailJS integration, and direct links (Email, Telegram, X).
- **Blog**: Dynamic posts from Supabase, with pagination (3 posts/page for testing; adjustable), individual post views with timestamps, and back navigation.
- **Responsive Design**: Mobile-friendly layouts, hamburger menu, and adaptive 3D rendering.
- **Animations**: GSAP-powered reveals and bursts; reduced motion support.
- **SEO/Metadata**: OpenGraph tags for social sharing.
- **Footer**: Copyright and 3D model credits.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18, TypeScript 5
- **3D/Graphics**: Three.js 0.160 (with custom shaders for enhanced starfields), React Three Fiber, @react-three/drei
- **Animations/Scrolling**: GSAP 3.12, Lenis 1.0
- **Backend/DB**: Supabase 2.58 (for blog posts)
- **Forms/Email**: React Hook Form 7.63, EmailJS 4.4
- **Styling**: CSS (globals with variables, media queries)
- **Dev Tools**: ESLint 8.57 (strict config, 0 errors), Prettier 3.3, ts-node for scripts
- **Other**: xAI tools for planning/assistance during development

## Installation/Setup
1. Clone the repo: `git clone <repo-url>`
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local` (see below).
4. Run locally: `npm run dev` (opens at http://localhost:3000)
5. Lint/Format: `npm run lint` and `npm run format`
6. Build: `npm run build` (for production)

### Environment Variables
Copy to `.env.local`:
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EMAILJS_SERVICE_ID=your-emailjs-service-id
EMAILJS_TEMPLATE_ID=your-emailjs-template-id
EMAILJS_USER_ID=your-emailjs-user-id
EMAILJS_PRIVATE_KEY=your-emailjs-private-key

- Supabase: For blog posts (create "posts" table with columns: id, title, description, content, slug, created_at).
- EmailJS: For contact form submissions.

## Deployment
- **Platform**: Vercel (automated CI/CD with GitHub integration).
- Steps:
  1. Push to GitHub (main branch for prod).
  2. Import repo in Vercel dashboard.
  3. Add env vars in Vercel settings.
  4. Set custom domain (abyss.global) with DNS (A record: 76.76.21.21; CNAME for www).
- Status: Ready for deploy—clean build, no errors. Post-deploy, test Supabase integration live.

## Credits/License
- 3D Models: "Earth" by denis_cliofas & "space boi" by silvercrow101 (CC Attribution via Sketchfab).
- License: MIT (feel free to fork/use, but credit original).

For questions, contact via the site or GitHub issues. Built solo in 2025.