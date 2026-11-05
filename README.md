<div align="center">

<img src="https://img.shields.io/badge/SRT%20DEMON-Unleashed%203D-ef4444?style=for-the-badge&logoColor=white"/>

# SRT DEMON UNLEASHED
### Cinematic 3D Automotive Web Experience

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TanStack](https://img.shields.io/badge/TanStack-Start%20%26%20Router-FF4154?style=for-the-badge)](https://tanstack.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Radix UI](https://img.shields.io/badge/Radix%20UI-Accessible%20Primitives-black?style=for-the-badge&logo=radix-ui&logoColor=white)](https://www.radix-ui.com/)
[![Netlify](https://img.shields.io/badge/Netlify-Edge%20Ready-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

<br/>

> **"This is NOT a landing page. This is NOT a dealership site. This is an immersive Hollywood-grade digital adrenaline rush."**

A state-of-the-art interactive automotive web experience built to celebrate the Dodge Challenger SRT Demon. Designed from the ground up with bleeding-edge web technologies, real-time audio telemetry, reactive 3D canvas mechanics, and zero-compromise motion design.

<br/>

[🚀 Quick Start](#-quick-start) · [✨ Core Features](#-core-features) · [🛠️ Tech Stack](#-technology-stack) · [📁 Architecture](#-project-structure) · [🌐 Deployment](#-deployment)

</div>

---

## ✨ Core Features

* **🏎️ Cinematic Hero Entrance**: High-impact visual trailer feel with visceral sound design, smoke shaders, and ignition sequences.
* **⚡ 1,025 HP Performance Telemetry**: Interactive drag strip simulator tracking 0-60 MPH times, G-force readouts, and quarter-mile acceleration curves.
* **🔊 Reactive Engine Sound Engine**: Web Audio API integration allowing users to rev the supercharged 6.2L HEMI V8 engine with interactive RPM tachometer feedback.
* **🎨 Precision Vehicle Customizer**: Switch between iconic Dodge Demon factory colorways with dynamic metallic paint reflections and carbon fiber detailing.
* **📱 Ultra-Responsive Single Page Architecture**: Flawless compositor-level performance across ultra-wide desktop monitors, laptops, and mobile screens.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Core Framework** | React 19 + TypeScript | High-performance reactive UI rendering |
| **Routing & App Core** | TanStack Start & TanStack Router | Modern full-stack routing & server functions |
| **Build Tooling** | Vite 6 | Lightning-fast HMR and optimized tree-shaken bundles |
| **Component Primitives** | Radix UI | Accessible, unstyled UI primitives (Dialog, Accordion, Menus) |
| **Design System** | Tailwind CSS v4 | High-contrast dark automotive aesthetic |
| **Edge Hosting** | Netlify / Vercel | Pre-configured `netlify.toml` and SPA build targets |

---

## 🚀 Quick Start

### Prerequisites
* **Node.js**: `v20.0.0` or higher
* **npm** / **bun** / **pnpm**

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/pasha804/srt-demon-unleashed-3d.git
cd srt-demon-unleashed-3d

# Install dependencies
npm install
```

### 2. Run Locally
```bash
npm run dev
```

Visit `http://localhost:3000` or the port shown in your terminal.

### 3. Production Build
```bash
# Standard Full-Stack Build
npm run build

# Standalone SPA Bundle
npm run build:spa
```

---

## 📁 Project Structure

```
srt-demon-unleashed-3d/
├── public/                 # Audio files, car sound effects, textures, icons
├── src/
│   ├── components/         # Telemetry dials, 3D views, audio buttons, modals
│   ├── routes/             # TanStack file-based routes (__root.tsx, index.tsx)
│   ├── hooks/              # Custom hooks for sound, viewport & device detection
│   └── styles/             # Global CSS and custom animations
├── netlify.toml            # Edge deployment routing and headers
├── vite.config.ts          # Vite build config
└── package.json            # Scripts & dependencies
```

---

## 🌐 Deployment

The repository includes both full-stack Nitro configuration and a dedicated `vite.spa.config.ts` for static hosting:

```bash
# Build SPA for Netlify / Vercel / GitHub Pages
npm run build:spa
```

The output in `dist-spa/` can be dropped onto any static host or CDN.

---

## 📄 License

MIT © [Pasha Dev](https://github.com/pasha804)

---

<div align="center">

**SRT DEMON UNLEASHED — Pure Power, Zero Apologies.**

*Created by **Pasha Dev***

</div>
