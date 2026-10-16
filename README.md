# 🛣️ InfraTwin AI — Autonomous Road Infrastructure Digital Twin & GenAI Platform

[![Next.js](https://img.shields.io/badge/Next.js-14%20(App%20Router)-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vengeance UI](https://img.shields.io/badge/Vengeance_UI-Spotlight_Bento-00d9ff?style=flat-square)](https://vengenceui.com/)
[![Groq Llama-3](https://img.shields.io/badge/Groq-Llama--3.3--70B-f97316?style=flat-square)](https://console.groq.com/)
[![Code Meta AI](https://img.shields.io/badge/Code_Meta_AI-CodeLlama--70B-0081fb?style=flat-square)](https://ai.meta.com/)
[![Swytchcode](https://img.shields.io/badge/Swytchcode-Durable_Workflow-10b981?style=flat-square)](https://swytchcode.com/)
[![CodeMate AI](https://img.shields.io/badge/CodeMate_AI-OWASP_Auditor_A%2B-purple?style=flat-square)](https://codemate.ai/)
[![IRC Standard](https://img.shields.io/badge/IRC:82--2023-Compliant-10b981?style=flat-square)](https://irc.nic.in/)

> **InfraTwin AI** is an autonomous, end-to-end smart city road infrastructure auditing platform engineered for municipal authorities (NDMC, NHAI, PWD), highway contractors, and drone inspection teams across India.

---

## ✨ System Architecture & Core Modules

### 🎨 1. Vengeance UI Next-Gen Interface Design
- **Spotlight Mouse-Tracking Bento Cards (`components/ui/VengenceCard.tsx`)**: Dynamic radial cursor spotlight tracking with cybernetic corner bracket marks.
- **Vengeance Glass Dock (`components/layout/Navbar.tsx`)**: Elevated floating header with quick command palette trigger (`⌘ K`) and live telemetry stream indicators.
- **Ambient Aurora Shimmer Background (`components/ui/VengenceBackground.tsx`)**: Global rotating aurora rays (`@keyframes raySweep`) and cybernetic grid overlay.

### 🤖 2. Nirman Copilot & Multi-Model Inference (`/copilot`)
- **Multi-Model Support (`lib/groq.ts`)**: Choose between `Llama-3.3-70b-versatile` and Meta's `Code Llama 70B / 34B (Code Meta AI)` for zero-syntax-error structured JSON BOQ synthesis.
- **Swytchcode Durable Execution Engine (`lib/swytchcode.ts`)**: 4-step durable workflow pipeline with automatic retries, exponential backoff, state persistence, and OpenAPI CLI spec generation.
- **IRC Statutory RAG Grounding**: Grounded in **IRC:82-2023**, **IRC:37-2018**, and **MoRTH Section 3000** specifications.

### 🛡️ 3. Contractor SLA & Real-Time Fraud Audit (`/fraud-detection` & `/sla-verification`)
- **Draggable Split-Screen Drone Viewer**: Compare **Before Repair (Red Outline)** vs **After Repair (Green Outline)** volumetric scans.
- **Automated Payment Freeze**: Real-time material variance sliders automatically freeze contractor escrow payments if claims exceed SLA tolerances.

### 🗺️ 4. Spatial Digital Twin & Mapbox Engine (`/map`)
- **Digital Twin Cities**: Switch seamlessly between **New Delhi** and **Pune** smart city zones.
- **Interactive Scanned Pins**: Clickable green, yellow, and red pins triggering 3D metric popups.

### 📈 5. Predictive Maintenance & Budget Allocation (`/predictive`)
- **Interactive Time Horizon Forecast**: 6, 12, 24, and 36-month horizon selector dynamically recalculating preventative vs deferred reconstruction budgets.

### 📋 6. Full 13-Module Enterprise Suite
- **`/dashboard`** — Live IST clock, animated counters, active drone sorties telemetry.
- **`/issues`** — Ticket command center with severity filters and audit links.
- **`/work-orders`** — Contractor work order progress and escrow hold management.
- **`/analytics`** — Recharts PCI degradation trend lines and contractor SLA leaderboards.
- **`/assets`** — Smart city pavement inventory (1,840 km), UAV drone fleet, thermal IR sensors.
- **`/team`** — Municipal engineering staff roster and flight lead assignments.
- **`/settings`** — YOLOv8 confidence sliders, depth scale parameters, CodeMate AI auditor, and Swytchcode engine control panel.

### 🛡️ 7. CodeMate AI OWASP Security & Quality Auditor (`/api/codemate/audit`)
- **Automated SDLC Quality Gating**: Static analysis, OWASP Top 10 vulnerability checks, TypeScript strictness validation, and GPU WebGL canvas memory leak checks.

---

## 🛠️ Tech Stack & Integrations

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (100% Strict Coverage)
- **Styling & UI**: TailwindCSS, Vengeance UI Design System, Framer Motion
- **AI Inference**: Groq API, Meta Code Llama (Code Meta AI), Llama-3.3-70B
- **Agentic Engine**: Swytchcode Durable Execution Engine (`/swytchcode-openapi.json`)
- **Code Quality**: CodeMate AI SDLC Auditor (`98/100 A+ Health Score`)
- **GIS & Mapping**: MapLibre GL / Mapbox Vector Engine
- **3D Graphics**: Three.js / React Three Fiber

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Varun-Khandelwal31/Infra-Twin-AI-.git
cd Infra-Twin-AI-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create `.env.local`:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📡 API Endpoints

- `POST /api/copilot` — Accepts prompt and inspection context to return Swytchcode durable BOQ calculations.
- `GET /api/codemate/audit` — Runs automated CodeMate AI security and code quality audits.
- `GET /api/roads` — Returns GeoJSON FeatureCollection of road networks and PCI degradation scores.
- `GET /swytchcode-openapi.json` — Downloads Swytchcode CLI OpenAPI specification.

---

## 📜 Statutory Standards Compliance
- **IRC:82-2023** — Code of Practice for Maintenance of Bituminous Surfaces
- **IRC:37-2018** — Guidelines for Design of Flexible Pavements
- **MoRTH Section 3000** — Ministry of Road Transport & Highways Specifications

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for details.
