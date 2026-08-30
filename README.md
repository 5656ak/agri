# 🌾 KrishiVigyan AI (कृषि विज्ञान)
### किसानों के लिए वैज्ञानिक कृषि सहायक | Smart India Hackathon (SIH) Prototype

> **An AI-powered, ICAR & KVK-aligned agricultural decision-support web application for Indian farmers.**

---

## 🌟 Key Pillars & Features

1. **Deterministic STCR Fertilizer Advisor**
   - Implements **ICAR-Indian Institute of Soil Science (IISS)** Target Yield Mathematical Equations.
   - Computes pure nutrient requirement ($N, P_2O_5, K_2O\text{ kg/ha}$) and converts to standard commercial fertilizer bags (Urea 46% N, DAP 18:46:0, MOP 60% K2O).
   - Strict safety rule: Unverified combinations automatically prompt: *"Verified recommendation unavailable. Please consult your nearest KVK/agricultural expert."*

2. **10-Stage Comprehensive Crop Lifecycle Guide**
   - End-to-end agronomic Package of Practices (PoP) across all 10 milestones:
     1. Seed Selection & Treatment
     2. Land Preparation & Soil Health
     3. Sowing / Transplanting
     4. Germination & Establishment
     5. Vegetative / Tillering (CRI Stage)
     6. Flowering & Panicle Initiation
     7. Fruiting / Grain Filling
     8. Physiological Maturity
     9. Harvesting & Threshing
     10. Post-Harvest & Safe Storage
   - Covers 8 major crops: Wheat, Rice, Cotton, Tomato, Potato, Mustard, Maize, and Gram.

3. **AI Crop Health Doctor (UI Shell & Pathology Knowledge Base)**
   - Structured 30+ disease knowledge base with observed symptom checklists, lookalike differential checks, and CIB&RC-registered chemical records.
   - Strict disclaimer: *"AI-assisted assessment — not a confirmed diagnosis."*

4. **Kisan Mitra Multilingual Voice & Chat Assistant (UI Shell)**
   - Mobile-first chat interface supporting simple Hindi and English.
   - Built to ensure all future answers are strictly grounded in verified agricultural research.

5. **Frontline KVK Directory & Toll-Free Helpline**
   - Integrated directory of district Krishi Vigyan Kendras with direct access to the national Kisan Call Center (`1800-180-1551`).

6. **Full Research & Source Transparency**
   - Every scientific recommendation includes an inspectable **Research Source Panel** citing authentic apex bodies (**ICAR, ICAR-IISS, ICAR-IIWBR, ICAR-IIRR, ICAR-CPRI, CIB&RC, DAC&FW**).

---

## 🏗️ Project Architecture & Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Custom Agriculture CSS Design System + Lucide Icons.
- **Data & Knowledge Layer**: Decoupled, schema-validated JSON repositories (`/src/data/agriculture/`).
- **Testing**: Automated unit test suite via **Vitest** (20 passing tests validating data integrity, STCR bounds, and safety gates).
- **Design Aesthetic**: Mobile-first, high-contrast earthen green palette (`#12372A`, `#1E5631`, `#2D6A4F`, `#D4A373`), 48px+ tap targets, Google Fonts (`Noto Sans Devanagari` + `Outfit` + `Inter`).

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+) & npm

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/5656ak/agri.git
cd agri

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Run automated test suite
npm test

# 5. Build for production
npm run build
```

---

## 🛡️ Research & Prototype Disclaimer

*KrishiVigyan AI is an agricultural decision-support hackathon prototype structured around publicly available Package of Practices from ICAR institutes, State Agricultural Universities, and CIB&RC guidelines. It does not claim official endorsement by these institutions.*
