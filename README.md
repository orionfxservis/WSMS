# WSMS - Water Supply Management System (Sample 03)
### Mineral Water Supply Management Software in Pakistan

> **Smart Business Management for Water Suppliers, Distributors & 19-Litre Canes Delivery Services**

Simplify your Mineral Water Supply Business with WSMS (Sample 03), a modern React TypeScript Single Page Application built for water suppliers and distributors across Pakistan.

---

## ✨ Features in this React Application (Sample 03)

- **Interactive Multi-View Single Page Application**:
  - **Landing View**: Modern hero section, quick role sign-in card, live workflow demo, about section, and footer.
  - **Live Operations Dashboard View**: Comprehensive operations telemetry, live deliveries feed, route dispatch, inventory status, and revenue/expense reconciliation.
  - **Field Hub View**: Real-time operations node designed for filling stations, suppliers, and drivers.
- **Karachi Live News Ticker**: Real-time water board telemetry and regional updates with auto-rotation.
- **ROI & Supply Calculator**: Interactive sliders to estimate monthly revenue and prevent annual can shrinkage.
- **One-Click Role Login**: Instant access as Admin, Supplier, Station Operator, or Driver with session state management.
- **WCAG Accessibility Inspector**: Built-in accessibility checker.

---

## ⚡ Zero-NPM Architecture (No Build Step, No Node.js Required)

This application has been pre-compiled into a self-contained production bundle (`assets/app.js` and `assets/app.css`):

1. **Run Locally**:
   - Double-click **`index.html`** in any web browser (Chrome, Edge, Firefox, Safari).
   - The entire React application opens and runs immediately.

2. **Host on GitHub Pages (Zero Errors, No Blank Screen)**:
   - Push or upload this folder to your GitHub repository:
     ```bash
     git add .
     git commit -m "Deploy WSMS Sample 03 React app"
     git push origin main
     ```
   - In your GitHub repository:
     - Go to **Settings** > **Pages**
     - Under **Build and deployment**:
       - **Source**: Select `Deploy from a branch`
       - **Branch**: Select `main`
       - **Folder**: Select either **`/(root)`** OR **`/docs`**
       - Click **Save**
   - Your live React app will be published at:
     `https://<YOUR_USERNAME>.github.io/<YOUR_REPOSITORY>/`

---

## 📁 Project Structure

```text
├── index.html            <-- Main entry (loads pre-compiled React bundle)
├── 404.html              <-- GitHub Pages SPA routing fallback
├── .nojekyll             <-- Ensures raw static asset delivery on GitHub
├── logo.png              <-- WSMS brand logo
├── assets/
│   ├── app.js            <-- Pre-compiled React application bundle (Sample 03)
│   ├── app.css           <-- Pre-compiled application stylesheet
│   └── img/              <-- Graphic assets and branding
├── src/                  <-- React TypeScript source code
│   ├── App.tsx           <-- Main application component (Views: landing, dashboard, field-hub)
│   ├── components/       <-- DashboardView, LabourSupplierHub, Navbar, HeroSection, etc.
│   ├── data/             <-- Initial mock data for inventory, deliveries, stations
│   └── types/            <-- TypeScript type definitions
├── docs/                 <-- Mirror for GitHub Pages /docs folder deployment
└── wsms-offline/         <-- Standalone copy for offline client distribution
```

---

## ⚖️ Compliance & Copyright
© 2025 Water Supply Management System. All rights reserved.
Sindh Food Authority, PECA 2016, and Contract Act 1872 compliant.
