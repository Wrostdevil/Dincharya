# 🌿 Dincharya — Circadian Productivity & Habit Architecture

<div align="center">

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore_%26_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio_API-Procedural_Sound-FF5722?style=for-the-badge&logo=audio&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**A tactile, neumorphic productivity suite combining Ayurvedic circadian biology (*Dincharya*), Notion-style 31-day neuroplasticity habit tracking, an SVG-rendered antique Waterbury mechanical clock with Web Audio acoustic escapement, Pomodoro focus workflows, and dual offline-first / Firebase cloud persistence.**

[Live Demo](https://ais-pre-kc54vs5vadzv6oj5r4h76q-834193165330.asia-east1.run.app) • [Features](#-key-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Architecture](#-architecture--directory-structure) • [License](#-license)

</div>

---

## 📖 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
  - [1. Notion-Style 31-Day Habit Tracker & Neuroplasticity Matrix](#1-notion-style-31-day-habit-tracker--neuroplasticity-matrix)
  - [2. Ayurvedic Circadian Routine (*Dincharya*)](#2-ayurvedic-circadian-routine-dincharya)
  - [3. Vintage Waterbury Horology Engine](#3-vintage-waterbury-horology-engine)
  - [4. Cortisol-Reducing Procedural Audio Synthesizer](#4-cortisol-reducing-procedural-audio-synthesizer)
  - [5. Pomodoro Focus Console & Task Manager](#5-pomodoro-focus-console--task-manager)
  - [6. Dual Persistence Layer (Offline-First + Firebase)](#6-dual-persistence-layer-offline-first--firebase)
- [Tech Stack](#-tech-stack)
- [Architecture & Directory Structure](#-architecture--directory-structure)
- [Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Available Scripts](#available-scripts)
- [Configuration & Environment Variables](#-configuration--environment-variables)
- [Design System & Neumorphism](#-design-system--neumorphism)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 About The Project

Modern productivity tools are often noisy, flat, and anxiety-inducing—inundating users with urgent push notifications, rigid calendars, and friction.

**Dincharya** was built to provide an intentional, restorative digital sanctuary. It blends:
- **Ancient Chronobiology**: Aligning daily rhythms with the natural solar cycle and dosha energies (*Vata*, *Pitta*, *Kapha*).
- **Behavioral Neurobiology**: Tracking habits across the proven 21-day neuroplastic adaptation curve.
- **Physical Skeuomorphism**: Tactile neumorphic surfaces with realistic soft shadows and pressed-state mechanics.
- **Antique Horology**: An authentic 1890s American mantel clock rendered in procedural SVG with live mechanical gear and pallet lever motion.
- **Acoustic Science**: Procedural Web Audio API soundscapes (528 Hz Solfeggio, 432 Hz vagus nerve reset, binaural beats, and rain) that clear cortisol without streaming lag or audio ads.

---

## ✨ Key Features

### 1. Notion-Style 31-Day Habit Tracker & Neuroplasticity Matrix
- **Interactive Day Grid**: Full 28–31 day matrix with sticky column headers, habit color codes, and quick-toggle completion status.
- **Neuroplasticity Adaptation Milestones**: Automatically calculates continuous progress and assigns scientific formation stages:
  - 🌱 **Sprouting (Days 1–7)**: Overcoming initial behavioral inertia.
  - 🌿 **Forming (Days 8–14)**: Early neural pathway stabilization.
  - 🌲 **Building (Days 15–20)**: Myelination and behavioral momentum.
  - 🧬 **Adapted (Days 21–29)**: The 21-day neuroplasticity threshold where routines feel automatic.
  - 👑 **Mastered (Days 30+)**: Full identity-level habit integration.
- **Celebration Feedback**: Soft tactile audio clicks on check, and reward confetti explosions upon hitting goal milestones.

### 2. Ayurvedic Circadian Routine (*Dincharya*)
- **Diurnal Clock Sync**: Automatically detects current time of day and highlights the active biological phase:
  - 🌅 **Pratah / Brahma Muhurta (04:00 – 06:00, Vata)**: Awakening, breathwork, meditation, and nasal cleansing (*Jala Neti*).
  - 🏃 **Vyayama & Snana (06:00 – 10:00, Kapha)**: Vigorous movement, yoga, bathing, and light breakfast.
  - ☀️ **Madhyanha (10:00 – 14:00, Pitta)**: Peak digestive fire (*Agni*), analytical problem-solving, and deep focus.
  - 🎨 **Aparanha (14:00 – 18:00, Vata)**: Creative exploration, collaboration, and gentle hydration.
  - 🌆 **Sandhya (18:00 – 22:00, Kapha)**: Digital sunset, light supper, gratitude, and mental winding down.
  - 🌙 **Nidra / Ratri (22:00 – 04:00, Pitta)**: Deep restorative sleep, cellular repair, and memory consolidation.
- **Dosha Insights**: Educational guides explaining how Vata (air/ether), Pitta (fire/water), and Kapha (earth/water) balance your daily physical and mental energy.

### 3. Vintage Waterbury Horology Engine
- **Procedural Vector Dial**: 100% SVG vector rendering of an authentic 1890s Waterbury clock dial with antique calligraphic Arabic numerals and blued-steel spade hands.
- **Functional Brocot Escapement**: Real-time rendering of an exposed 15-tooth ratchet escape wheel oscillating synchronously with dual jeweled pallet pins and balance spring.
- **Acoustic Escapement Ticking**: Procedural Web Audio impulses generating alternating high/low metallic "tic-toc" clicks.
- **Horological Loupe View**: Interactive modal allowing magnification and inspection of the escapement action and wheel train.

### 4. Cortisol-Reducing Procedural Audio Synthesizer
- **100% Client-Side Procedural Synthesis**: Zero audio files to download—runs directly through the native browser Web Audio API:
  - 🧬 **528 Hz Solfeggio Tone**: Studied harmonic known for downregulating salivary cortisol and supporting autonomic balance.
  - 🧘 **432 Hz Vagus Nerve Reset**: Natural harmonic tone designed to slow heart rate and calm sympathetic fight-or-flight arousal.
  - 🥣 **Tibetan Singing Bowls**: Multi-octave metallic drones with slow phase beating.
  - 🎧 **Binaural Brainwave Entrainment**: True stereo-split frequency detuning for Alpha (10 Hz flow), Theta (6 Hz anxiety release), and Delta (2.5 Hz cortisol flush).
  - 🌧️ **Atmospheric Nature Generators**: Procedural pink/white noise filters reproducing steady rainfall and ocean waves.

### 5. Pomodoro Focus Console & Task Manager
- **Unified Global State**: Shared timer synchronization across top navigation, hero poster, dashboard, and standalone timer console.
- **4 Distinct Modes**: Standard Pomodoro (25m), Short Break (5m), Long Break (15m), and Deep Work (50m/90m).
- **Task Association**: Link sessions directly to tasks to automatically record completed intervals and cumulative focus hours.
- **Prioritized Task Board**: Filter by priority (`low`, `medium`, `high`, `urgent`), category tags (`Work`, `Design`, `Study`, `Health`, `Personal`), subtask checklists, and due dates.

### 6. Dual Persistence Layer (Offline-First + Firebase)
- **Zero Friction**: New users can immediately use all features without logging in (persists in LocalStorage).
- **Cloud Synchronization**: Optional Firebase Authentication (Email/Password or Anonymous) with Firestore collections (`users/{uid}/tasks`, `habits`, `trackedHabits`, `habitLogs`, `sessions`). Automatic migration merges local entries into the cloud profile upon login.

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Component hierarchy, state primitives, concurrent UI rendering |
| **TypeScript 5.8** | Strict static type safety across data contracts and APIs |
| **Vite 6** | Ultra-fast local development and tree-shaken production bundles |
| **Tailwind CSS v4** | CSS modern variables and utility-first styling |
| **Web Audio API** | Real-time procedural audio synthesis (zero external audio assets) |
| **Firebase 12** | Cloud Authentication and Firestore cloud database synchronization |
| **Lucide React** | Consistent, crisp vector icons |
| **Canvas Confetti** | Dynamic physics-based celebration particle system |

---

## 📂 Architecture & Directory Structure

```text
dincharya/
├── index.html                     # HTML5 root with neumorphic background and font declarations
├── package.json                   # App manifest, dependencies, and build scripts
├── vite.config.ts                 # Vite bundler configuration with React and Tailwind plugins
├── tsconfig.json                  # Strict TypeScript configuration
├── metadata.json                  # AI Studio capability declarations
└── src/
    ├── main.tsx                   # React DOM mount point
    ├── App.tsx                    # Root controller: route state, global audio/theme, sync bridge
    ├── index.css                  # Global design system: neumorphic tokens, sunken/raised utility classes
    ├── types.ts                   # Full domain TypeScript contracts (Habits, Dincharya, Tasks, Sessions)
    ├── components/
    │   ├── StartingPage.tsx       # Landing presentation with animated live clock & feature showcase
    │   ├── ShowcasePoster.tsx     # Hero overview poster with real-time controls and quick Pomodoro trigger
    │   ├── HabitTrackerView.tsx   # Notion-style 31-day habit grid with neuroplasticity adaptation tiers
    │   ├── DincharyaView.tsx      # Circadian timeline view with 6 diurnal phases & dosha recommendations
    │   ├── CalendarView.tsx       # Interactive monthly calendar with session logs and completion indicators
    │   ├── TodoList.tsx           # Prioritized task board with pomodoro estimates, subtasks & filters
    │   ├── PomodoroTimer.tsx      # Focus console with customizable intervals, modes & sound selector
    │   ├── AnalyticsTracker.tsx   # Productivity metrics, focus distributions, and streak tracking
    │   ├── SpotifyPlayer.tsx      # Curated focus music player with embedded ambient synth controls
    │   ├── VintageWaterburyClock.tsx # Procedural SVG horology: Brocot escapement, pallet jewel motion, audio tick
    │   ├── NeumorphicElements.tsx # Reusable UI primitives (NeuCard, NeuButton, NeuInput, NeuKnob, NeuSlider)
    │   ├── TaskModal.tsx          # Create/edit task modal with category, priority, and subtask support
    │   ├── AuthModal.tsx          # Dual sign-in modal (Cloud Firebase sync vs. offline local profile)
    │   ├── SearchModal.tsx        # Omnisearch across tasks, habits, and focus sessions
    │   └── ZenModal.tsx           # Fullscreen minimalist focus sanctuary
    └── utils/
        ├── audio.ts               # Web Audio API engine (clock ticking, binaural beats, 528Hz, rain)
        ├── dincharyaData.ts       # Diurnal circadian phases and Ayurvedic habit definitions
        ├── firebase.ts            # Firebase Auth & Firestore CRUD with offline-to-cloud migration
        ├── habitTrackerData.ts    # Date math, streak calculations, and neuroplasticity tier algorithms
        └── storage.ts             # LocalStorage schema initialization, persistence, and seed data
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or `pnpm` / `yarn`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/dincharya.git
   cd dincharya
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` to preview the app.

### Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts Vite dev server with hot module reloading on port 3000 |
| `npm run build` | Compiles TypeScript and creates optimized production build in `dist/` |
| `npm run preview` | Locally preview the built production bundle |
| `npm run lint` | Runs TypeScript compiler checks without emitting files (`tsc --noEmit`) |
| `npm run clean` | Deletes build artifacts (`dist/`) |

---

## ⚙️ Configuration & Environment Variables

Create a `.env` file in the project root if you want to connect to your own Firebase project:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **Note**: If Firebase environment variables are omitted, Dincharya runs smoothly in full **Offline-First Mode** using browser `LocalStorage`.

---

## 🎨 Design System & Neumorphism

Dincharya is engineered around tactile neumorphic design tokens configured in `src/index.css`:

```css
:root, .theme-classic {
  --bg-base: #ebf0f7;
  --bg-card: #ebf0f7;
  --border-color: rgba(255, 255, 255, 0.7);
  --border-subtle: #d6e0ec;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --accent-color: #6366f1;
  --shadow-light: #ffffff;
  --shadow-dark: #c2cdda;
}
```

- **Raised / Convex Surface**: `box-shadow: 8px 8px 18px var(--shadow-dark), -8px -8px 18px var(--shadow-light);`
- **Sunken / Inset Surface**: `box-shadow: inset 3px 3px 6px var(--shadow-dark), inset -3px -3px 6px var(--shadow-light);`
- **Dark Mode (Obsidian)**: Deep carbon baseline `#0f1117` with low-glow specular highlights `#1e222c` and deep shadows `#06070a`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
  <sub>Built with care for circadian balance, sustained focus, and deep mental clarity.</sub>
</div>
