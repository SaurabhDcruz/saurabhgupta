# Immersive WebGL Experience

A cinematic React + Vite experience built with Three.js, GSAP, Lenis, and Zustand.

## Getting started

Install dependencies:

```bash
npm install
```

Start the development environment:

```bash
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Project structure

- `src/components/` — reusable interactive UI components
- `src/scenes/` — modular Three.js scene and object components
- `src/hooks/` — scroll integration and cinematic timeline hooks
- `src/store/` — Zustand slices and centralized application state
- `src/styles/` — global theme and layout styling
- `src/utils/` — lightweight helpers and device detection
- `public/` — static assets and fallback directories

## Features

- Smooth Lenis-powered scrolling
- GSAP ScrollTrigger timeline and scroll state sync
- React Three Fiber canvas with postprocessing
- Custom cursor, magnetic buttons, and interactive overlay
- Loader screen with progress animation
- Responsive glassmorphism design system

## Notes

- Designed for performance and smoothness on modern devices.
- State is driven through Zustand and used to coordinate UI and 3D motion.
- The experience is intended to feel cinematic and immersive.
