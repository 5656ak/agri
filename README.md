# ⚡ NEXA Analytics — AI-Powered Business Intelligence Platform for SMBs

> **A production-quality, multi-user authenticated SaaS Business Intelligence platform designed with the precision, speed, and aesthetics of Linear, Stripe, and Vercel.**

---

## 🌟 Product Vision & Guarantees

NEXA Analytics enables small-and-medium business owners to upload or enter their transaction records and instantly understand:
* **Revenue Velocity & Sales Growth**
* **Net Operating Profit & Gross Margins**
* **Customer RFM Cohorts & Retention Curves**
* **Catalog SKU Unit Economics & Profitability**
* **Geographic Corridors & Regional Territory Maps**
* **Seasonal Auto-ARIMA Predictive Sales Forecasting**
* **Autonomous AI Executive Briefings & Recommendations**

### 🔒 Strict Zero-Data Guarantee
* **No Pre-populated Demo Data**: Newly registered workspaces initialize with strictly **0 transactions**, `₹0` revenue, `0` orders, and clean empty states.
* **Pure Dynamic Calculations**: Every chart, cohort, margin metric, and forecast envelope is calculated dynamically from the active user's ingested data.
* **Isolated User Partitioning**: Data is scoped per authenticated user (`nexa_user_orders_<userId>`), guaranteeing total multi-tenant separation.

---

## 🚀 Key Modules & Capabilities

### 1. Authentication & Session Management
* Multi-user registration with full name, business name, email, and password.
* Real-time password strength meter (minimum length, uppercase, numbers, special characters).
* Sign in with email and password, plus simulated one-click Google Social Auth.
* Forgot password workflow simulating password reset dispatch.

### 2. 3-Step Onboarding Wizard
* **Step 1 — Business Profile**: Company name, business vertical (E-commerce, Retail, SaaS, etc.), industry, and currency.
* **Step 2 — Analytical Goals**: Tailor intelligence for revenue optimization, margins, customer retention, or forecasting.
* **Step 3 — Data Ingestion**: Choose between CSV/Excel upload, interactive spreadsheet entry, or direct navigation to the workspace.

### 3. Flexible Ingestion Engine
* **CSV & Excel Upload**: Automatic header recognition and schema normalization with downloadable CSV template.
* **Manual Spreadsheet Editor**: Fast, keyboard-friendly table with row addition, duplication, deletion, live cell validation, and instant profit calculations.
* **Data Sources Management**: View all uploaded files, row counts, upload timestamps, and delete or replace datasets.

### 4. Dynamic Analytics & Forecasting Engines
* **Analytics Engine**: Computes time-series bucketing (daily, weekly, monthly, quarterly), category shares, regional territories, and channel attribution.
* **Seasonal Auto-ARIMA Forecast**: Generates 30-day, 90-day, 6-month, and 12-month projections with statistical confidence scores and interactive scenario multipliers.
* **AI Autonomous Analyst**: Evaluates operational momentum, margin leaks, and high-velocity SKUs, and answers natural language questions against the live dataset.

### 5. Executive Reports & Exports
* Board-ready executive briefs summarizing period performance, customer cohorts, and margin health.
* One-click CSV and JSON data export utilities.

---

## 🛠️ Tech Stack

* **Frontend**: React 18 + TypeScript + Vite
* **Icons & UI Elements**: Lucide React
* **Styling**: Custom modern design system with CSS custom properties, light/dark themes, and responsive layouts
* **Testing**: Vitest automated unit test suite (13 passing tests)
* **Build & Bundler**: Vite 6 + TypeScript compiler

---

## 💻 Local Development

### Prerequisites
* Node.js (v18+) & npm

### Setup
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Run unit tests
npm test

# 4. Build for production
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 🌐 Deployment

### 1. GitHub Pages (Live via `gh-pages` branch)
The production bundle is pushed to the `gh-pages` branch of this repository.
1. In your GitHub repository, open **Settings** > **Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Select branch **`gh-pages`** and folder **`/ (root)`**, then click **Save**.
4. Your site will be live at `https://<username>.github.io/<repo>/`.

### 2. Vercel
1. Go to [vercel.com/new](https://vercel.com/new) and import this repository.
2. Vercel automatically detects `vercel.json` with `buildCommand: "npm run build"` and `outputDirectory: "dist"`.
3. Click **Deploy**.

### 3. Netlify
1. Go to [app.netlify.com](https://app.netlify.com) and import this repository.
2. Netlify automatically reads `netlify.toml` with `publish = "dist"` and SPA redirect rules.
3. Click **Deploy Site**.

---

## 📄 License
MIT © 2026 NEXA Analytics Inc. All rights reserved.
