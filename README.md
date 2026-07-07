# OmniSync AI: Unified Cognitive Operations Command Center

An enterprise-ready, high-fidelity administrative suite that aggregates domain-specific operations into a unified command dashboard. Designed with premium space-glassmorphism visuals, live telemetry charts, and decoupled backend micro-services.

---

## 🚀 Live Demo
- **Frontend (Vercel)**: [https://omni-sync-ai.vercel.app/](https://omni-sync-ai.vercel.app/)
- **Backend API (Render)**: [https://omnisync-ai.onrender.com/api/v1/health](https://omnisync-ai.onrender.com/api/v1/health)

---

## 🌐 Executive Summary
OmniSync AI consolidates ten distinct analytical domains into a single operations portal. Instead of operating as disjointed, standalone tools, they are integrated as secure subsystems managed under a central console featuring real-time socket logging, sub-second telemetry loops, and clinical-grade reporting.

---

## 🛠️ Technology Stack
*   **Frontend**: React 19, Vite, Three.js (WebGL Render Pipeline), Lucide icons.
*   **Backend**: Node.js, Express, WebSocket (WS Stream Handlers).
*   **Database**: MongoDB / Mongoose (with automated fallback to local JSON database for offline development).
*   **Design Paradigm**: Glassmorphic dark mode, blurred neon backdrop orbs, smooth hover elevation lifts, and high-contrast telemetry indicators.

---

## 📂 Project Architecture & Directory Structure
```text
OmniSync AI/
├── backend/
│   ├── data/
│   │   └── db.json                 # Local fallback database file
│   ├── routes/
│   │   ├── api.js                  # Main Express Router bootstrapping modules
│   │   ├── courtOrder.js           # Judicial Records handler
│   │   ├── farming.js              # Agronomic Resource planner
│   │   ├── hazards.js              # Civic Infrastructure hazard ledger
│   │   ├── healthcare.js           # Cardiometabolic Analytics engine
│   │   ├── inventory.js            # Warehouse Stock controller
│   │   ├── maternal.js             # Patient Vitals telemetry router
│   │   ├── socialMedia.js          # Sentiment Monitor scanner
│   │   └── supplyChain.js          # Cryptographic Logistics Blockchain ledger
│   ├── db.js                       # MongoDB connection adaptor & Local JSON fallback
│   ├── package.json
│   └── server.js                   # WebSocket Server & HTTP Bootstrap
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── DashboardOverview.jsx  # Telemetry center & multi-agent logging console
│   │   │   ├── Sidebar.jsx            # Unified brand navigation containing neon branding
│   │   │   ├── SocialAnalyzer.jsx     # Public Sentiment monitor
│   │   │   ├── CourtExtractor.jsx     # Judicial Records metadata extraction
│   │   │   ├── HealthcareAnalytics.jsx# Risk calculator & factor classification
│   │   │   ├── SustainableFarming.jsx  # Soil chemical analysis & pathogen detection
│   │   │   ├── InventoryManager.jsx   # Warehouse forecasting & procurement agents
│   │   │   ├── InteriorDesigner.jsx   # 3D Facility Spatial Modeler (WebGL canvas)
│   │   │   ├── SupplyChainTracker.jsx # On-chain transaction ledger signing
│   │   │   ├── MaternalMonitor.jsx    # Patient vitals tracking & kick count timers
│   │   │   ├── RoadHazardReporter.jsx # Civic infrastructure hazard coordinates report
│   │   │   ├── SignLanguageTranslator.jsx # Real-time Web Socket camera frame translation
│   │   │   └── ErrorBoundary.jsx
│   │   ├── App.css
│   │   ├── App.jsx                 # Viewport manager & global API router
│   │   ├── index.css               # Core styling tokens, orbs, glassmorphic rules
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── package.json                    # Root package running concurrent scripts
└── README.md                       # Complete Developer Solution Documentation
```

---

## 🎛️ Subsystem Mapping Reference
Each modular component functions as an integrated dashboard component:

| Original Module | Unified Operations Module | Functionality |
| :--- | :--- | :--- |
| **Social Media Analyzer** | **Public Sentiment Monitor** | Natural language analysis of profile feeds returning Reputation Scores and Risk narratives. |
| **Court Order Extraction** | **Judicial Records Engine** | Scrapes metadata (judge, court, date, petitioner) and verdicts from unstructured legal text. |
| **Healthcare Analysis** | **Cardiometabolic Analytics** | Predicts readmission, diabetes, and heart failure metrics using clinical risk factor vectors. |
| **Sustainable Farming** | **Agronomic Resource Planner** | Suggests irrigation schedules, crop rotations, and identifies pathogens in leaf uploads. |
| **Retail Inventory MultiAgent** | **Warehouse Stock Controller** | Integrates Forecasting, Pricing, and Procurement agent logs into a custom inventory table. |
| **AR/VR Interior Design** | **Facility Spatial Modeler** | Direct manipulation of physical shapes (sofa, table, bed) inside an interactive Three.js 3D WebGL scene. |
| **Decentralized Supply Chain** | **Logistics Blockchain Ledger** | Creates a cryptographic blockchain ledger tracing product custodial handoffs and block hashes. |
| **Maternal Health Monitor** | **Patient Vitals Telemetry** | Obstetric health console tracking gestational indicators, kick counts, and vitals history. |
| **Pothole Road Hazard** | **Civic Infrastructure Hazards** | Directory mapping community-voted infrastructure hazards, GPS coordinates, and repair states. |
| **Sign Language Translator** | **Accessibility Gestures System** | Opens a real-time binary camera WebSocket pipeline to translate gesture sequences to speech. |

---

## ⚙️ Configuration & Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/omnisync
GROQ_API_KEY=gsk_YourKeyHere
```

*   **`PORT`**: Network port for API and WebSockets.
*   **`MONGODB_URI`**: Production-grade Database connection. If empty or MongoDB is not running locally, the system seamlessly initializes and writes to `/backend/data/db.json`.
*   **`GROQ_API_KEY`**: API token used to run cognitive inference summaries using the ultra-fast Mixtral model.

---

## 📡 RESTful API (v1)
All API endpoints follow industry-standard RESTful practices and are versioned under the `/api/v1/` namespace (e.g. `/api/v1/agriculture/recommendations`).

---

## 🚀 Execution & Setup Instructions

### 1. Install Dependencies
Run from the root directory to fetch all subfolder packages:
```bash
npm install
```

### 2. Start Developer Mode
Executes both Express Backend (Port `5000`) and Vite Frontend (Port `5173`) concurrently:
```bash
npm run dev
```

### 3. Build for Production
Compiles optimized assets to serve static builds:
```bash
npm run build
```
