# Frontend Take-Home: Security Bundle Builder

Production-style React prototype for a multi-step bundle builder with a live review panel.

This project was built from the task brief for the Frontend Take-Home Bundle Builder challenge (Figma-driven implementation with synced quantity controls, variant logic, accordion behavior, responsive layout, and saved configuration state).

## Table of Contents

- Overview
- Task Brief Summary
- Tech Stack
- What Is Implemented
- Interaction Rules
- Data Source and Model
- MongoDB Fallback Mode
- Architecture
- Folder Structure
- Run From a Clean Clone
- Environment Variables
- Scripts
- Build and Validation
- Decisions and Tradeoffs
- Known Gaps
- Next Improvements

## Overview

The UI is a two-column shopping configuration experience:

- Left: a four-step accordion bundle builder
- Right: a live review panel reflecting current selections, line pricing, and totals

The app is data-driven, interactive, and persists saved configurations in localStorage.

## Task Brief Summary

The original assignment requested:

- High-fidelity desktop recreation of the provided Figma
- Responsive behavior down to phone sizes
- A working multi-step accordion flow
- Variant-level quantity tracking
- Synced quantity steppers between cards and review panel
- Live-updating review panel and totals
- Persistence via Save my system for later
- JSON-driven rendering (local JSON acceptable, backend as bonus)

This implementation uses an API route backed by MongoDB (bonus-style backend).

It also includes a local JSON fallback so the app remains usable if MongoDB is unavailable.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- MongoDB (via native driver)

## What Is Implemented

### 1) Four-step accordion builder

- Step 1 opens by default
- Step headers show selected counts
- Steps expand/collapse
- Next button advances to subsequent step

### 2) Data-driven product cards

Cards render from product data and support:

- Optional badges (for discounts)
- Product image, title, description
- Learn More link
- Variant selector when variants exist
- Quantity stepper
- Compare-at and active price display
- Selected state when quantity is above zero

### 3) Variant quantity behavior

- Each variant is tracked separately
- Card quantity controls apply only to the active variant
- Changing active variant changes which quantity is shown/edited
- Review includes each variant with quantity > 0 as separate lines

### 4) Live review panel

- Rows grouped by review category
- Per-line pricing updates with quantity
- Totals recalculate on every selection update
- Savings message and final checkout total shown
- Checkout action is prototype behavior (message feedback)

### 5) Save and restore

- Clicking Save my system for later stores the full configuration
- Reload restores quantities, active variants, and open step

## Interaction Rules

### Quantity sync

All quantity mutations flow through shared reducer state in Home.

Result:

- Product card steppers and review steppers stay in sync
- Totals, selected counts, and grouped lines update instantly

### Selected count logic

For each step, selected count equals number of distinct products in that step with total quantity greater than zero.

### Review ordering

Review rows are sorted by category order defined in shared bundle logic.

## Data Source and Model

### API route

Data is served by:

- GET /api/products

Route behavior:

- Reads collections Steps and Products from MongoDB
- If MongoDB request fails, serves local fallback data from data/dataFallback.json
- Returns { steps, products } in both cases (same response shape)

## MongoDB Fallback Mode

The products API route is resilient by design:

- Primary source: MongoDB (Steps + Products collections)
- Fallback source: data/dataFallback.json

When fallback is used:

- /api/products still responds with HTTP 200
- Returned payload keeps the same shape ({ steps, products })
- UI continues to render normally without manual code changes

This makes local development and demos reliable even if:

- MongoDB credentials are wrong
- Cluster/network is unavailable
- Database connection fails for any reason

### Types

Core domain types live in types/bundle_types.ts:

- Step
- Product
- Variant
- ProductCategory
- QuantityState
- ActiveVariantState
- ReviewLine
- BundleTotals

### Current category set

ProductCategory currently supports:

- Cameras
- Sensors
- Accessories
- Plan
- Shipping

## Architecture

### Main data flow

1. Server-side fetch in lib/getProducts
2. API route app/api/products/route.ts returns bundle data
3. Home reducer initializes from defaults + persisted data
4. Derived helpers in lib/bundleBuilder.ts compute:
   - products by step
   - review lines
   - totals

### Core modules

- components/home.tsx
  - state reducer
  - action dispatchers
  - save/checkout handlers

- components/StepSection.tsx
  - accordion step rendering
  - selected count and next-step controls

- components/ProductsCard.tsx
  - card rendering
  - active variant image and per-variant controls

- components/ReviewPanel.tsx
  - grouped review rows
  - line controls and total summary UI

- lib/bundleBuilder.ts
  - formatting utilities
  - init helpers
  - review line and totals builders

## Folder Structure

Top-level relevant files/folders:

- app/
  - page.tsx
  - globals.css
  - api/products/route.ts
- components/
  - home.tsx
  - StepSection.tsx
  - ProductsCard.tsx
  - QuantityStepper.tsx
  - ReviewPanel.tsx
- lib/
  - getProducts.ts
  - mongodb.ts
  - bundleBuilder.ts
- types/
  - bundle_types.ts

## Run From a Clean Clone

1. Clone and install:

```bash
git clone https://github.com/Muhamed-Essam18/bundle_builder.git
cd security-bundle
npm install
```

2. Create .env.local in project root:

```env
MONGODB_URI=mongodb://<db_username>:<db_password>@ac-szqqebn-shard-00-00.dgdoohc.mongodb.net:27017,ac-szqqebn-shard-00-01.dgdoohc.mongodb.net:27017,ac-szqqebn-shard-00-02.dgdoohc.mongodb.net:27017/?ssl=true&replicaSet=atlas-d02iqh-shard-0&authSource=admin&appName=Cluster0

MONGODB_DB=BundleBuilder
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Notes:

- If MONGODB_URI/MONGODB_DB are valid, app uses MongoDB data.
- If MongoDB fails, app automatically falls back to data/dataFallback.json.

3. Start development server:

```bash
npm run dev
```

4. Open:

- http://localhost:3000

## Environment Variables

- MONGODB_URI
  - MongoDB connection string (optional if using fallback mode)
- MONGODB_DB
  - Database name (optional if using fallback mode)
- NEXT_PUBLIC_SITE_URL
  - Base URL used for server-side fetch fallback

## Scripts

- npm run dev
  - Start local development server
- npm run build
  - Create production build
- npm run start
  - Run production server
- npm run lint
  - Run ESLint

## Build and Validation

Recommended validation flow:

```bash
npm install
npm run lint
npm run build
npm run start
```

To validate fallback behavior:

1. Set an invalid MONGODB_URI (or stop DB connectivity).
2. If you are not authorized , fallback will run automatically 
2. Run npm run dev.
3. Open /api/products and verify data still returns.
4. Open the app and confirm UI loads with fallback products/steps.

## Decisions and Tradeoffs

- Backend choice
  - Task allowed local JSON; this implementation uses MongoDB + API route for realistic data flow.

- State shape
  - Quantity state is nested by product id and variant id to support per-variant counts cleanly.

- Persistence scope
  - Saved config persists only builder state (quantities, active variants, open step), not transient UI messages.

- Styling approach
  - Tailwind utility-first styling was used for rapid fidelity tuning and responsive iteration.

## Known Gaps

- Some image elements still use plain img instead of next/image.
- No automated test suite included yet (logic currently verified manually and via lint/build).
- API currently expects collection names Steps and Products exactly.



