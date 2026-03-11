# MediStock – Pharmacy Inventory Management System

**Course:** Web Technologies – Case Study Project  
**Technology Stack:** HTML5 · CSS3 · Vanilla JavaScript  
**Domain:** Healthcare

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Design Approach](#2-design-approach)
3. [Layout Structure](#3-layout-structure)
4. [Page Flow Diagram](#4-page-flow-diagram)
5. [File Structure](#5-file-structure)
6. [HTML Structure Explanation](#6-html-structure-explanation)
7. [CSS Styling Explanation](#7-css-styling-explanation)
8. [JavaScript Functionality](#8-javascript-functionality)
9. [Sample Data](#9-sample-data)
10. [Program Output – Key Features](#10-program-output--key-features)
11. [How to Run](#11-how-to-run)
12. [Project Demonstration Guide](#12-project-demonstration-guide)

---

## 1. Problem Statement

Pharmacies and hospital dispensaries manage hundreds of medicines simultaneously. Manual, paper-based tracking leads to three critical failures:

- **Stock-outs** — medicines running out without warning, interrupting patient care
- **Expired stock** — medicines dispensed past their expiry date, posing patient safety risks
- **Lost procurement records** — no clear view of supplier spending or purchase history

**MediStock** is a browser-based pharmacy inventory management system that solves all three problems digitally. It provides a real-time dashboard, expiry-date colour alerts, low-stock warnings, a dispense log, and a supplier tracking module — all without requiring a server, database, or internet connection.

---

## 2. Design Approach

### Philosophy

The interface is designed to resemble a real-world internal web tool used by pharmacy staff. The visual language is deliberately clinical and professional: restrained colour, high information density, and no decorative elements that would distract from critical data.

### Key Design Decisions

| Decision | Rationale |
|---|---|
| Navy blue (`#1a4785`) primary palette | Conveys trust and authority appropriate for healthcare |
| DM Sans typeface | Highly legible at small sizes; modern without being playful |
| DM Mono for batch numbers and prices | Monospaced font makes code-like values scannable |
| Red / Amber / Green row coding | Universal traffic-light metaphor for urgency — no legend required |
| Card-based dashboard | Allows at-a-glance status without reading a table |
| Sticky navigation bar | Keeps page switching accessible on long pages |
| Modal confirmation dialogs | Prevents accidental deletion or incorrect dispensing |
| `localStorage` persistence | Data survives page refresh with no backend required |

### Responsive Strategy

The layout uses CSS Grid with breakpoints at `1024px` (tablet) and `768px` (mobile). On smaller screens, multi-column grids collapse to single columns, the navigation bar becomes a hamburger toggle menu, and table overflow is handled with horizontal scroll to preserve data integrity.

---

## 3. Layout Structure

### Shared Page Shell

Every page shares the same outer shell:

```
┌─────────────────────────────────────────────────────┐
│  NAVBAR  [+MediStock]  Dashboard · Inventory · ...   │
├─────────────────────────────────────────────────────┤
│                                                     │
│   PAGE HEADER  (title + subtitle + action button)  │
│                                                     │
│   PAGE-SPECIFIC CONTENT                             │
│                                                     │
├─────────────────────────────────────────────────────┤
│  FOOTER  [+MediStock]  tagline · copyright          │
└─────────────────────────────────────────────────────┘
```

### Dashboard Layout (`index.html`)

```
┌──────────────┬──────────────┬──────────────┐
│ Total Meds   │  Low Stock   │ Expiry Alerts│  ← Stat Cards (3-col grid)
└──────────────┴──────────────┴──────────────┘

┌─────────────────────────┬──────────────────┐
│   Recent Inventory      │  Low Stock       │
│   Table (last 6 items)  │  Alert Panel     │  ← 2-col grid
└─────────────────────────┴──────────────────┘
```

### Inventory Layout (`inventory.html`)

```
[ Expiry Legend: ● Expired  ● Near Expiry  ● Safe ]

┌────────────────────────────────────────────────────────┐
│ Medicine │ Batch │ Qty │ Expiry │ Supplier │ Price │ …  │
│  row (colour-coded by expiry status)                   │
│  row (colour-coded by expiry status)                   │
└────────────────────────────────────────────────────────┘
```

### Add Medicine Layout (`add.html`)

```
┌──────────────────────────────┬───────────────┐
│  FORM CARD                   │  SIDEBAR      │
│  ┌─ Medicine Information ──┐ │  Guidelines   │
│  │  Name · Batch           │ │               │
│  │  Quantity · Expiry      │ │  Inventory    │
│  │  Unit Price · OrderDate │ │  Summary      │
│  └────────────────────────┘ │               │
│  ┌─ Supplier Information ──┐ │               │
│  │  Name · Contact · Email │ │               │
│  └────────────────────────┘ │               │
│  [ Cost Preview Banner ]     │               │
│  [ Clear ]     [ Add ]       │               │
└──────────────────────────────┴───────────────┘
```

### Alerts Layout (`alerts.html`)

```
┌──────────────┬──────────────┬──────────────┐
│  Expired     │  Near Expiry │  Safe        │  ← Summary Cards
└──────────────┴──────────────┴──────────────┘

[ Colour Key: Red=Expired · Amber=Near · Green=Safe ]

┌──────────────────────────────────────────────────────┐
│ Medicine │ Batch │ Qty │ Expiry │ Days Left │ Status  │
│  (rows sorted by expiry date, soonest first)         │
└──────────────────────────────────────────────────────┘
```

### Suppliers Layout (`suppliers.html`)

```
┌──────────────┬──────────────┬──────────────┐
│  Suppliers   │ Medicine     │ Total        │  ← Summary Cards
│  Count       │ Lines        │ Inventory ₹  │
└──────────────┴──────────────┴──────────────┘

[ Supplier Directory Table ]

[ Purchase History Table (sorted by date, newest first) ]
```

---

## 4. Page Flow Diagram

```
                         ┌─────────────┐
                         │  index.html │
                         │  DASHBOARD  │◄──────────────────┐
                         └──────┬──────┘                   │
                                │                          │
           ┌────────────────────┼────────────────────┐     │
           ▼                    ▼                    ▼     │
   ┌───────────────┐   ┌────────────────┐   ┌──────────────┐
   │ inventory.html│   │   add.html     │   │  alerts.html │
   │   INVENTORY   │   │  ADD MEDICINE  │   │   EXPIRY     │
   │               │   │               │   │   ALERTS     │
   │ [Use Stock]   │   │ Form Submit   │   │ [Remove Med] │
   │ [Remove Med]  │   │   ──saves──►  │   └──────────────┘
   └───────────────┘   │  localStorage │
           │            └────────────────┘
           │                    │
           └────────────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ suppliers.html  │
                │    SUPPLIERS    │
                │ (reads from     │
                │  localStorage)  │
                └─────────────────┘

Data Flow:
  add.html ──writes──► localStorage ──reads──► inventory.html
                                     ──reads──► alerts.html
                                     ──reads──► suppliers.html
                                     ──reads──► index.html (dashboard)
```

All five pages share **one JavaScript file** (`script.js`) and **one CSS file** (`styles.css`). `localStorage` acts as the single source of truth — data written on any page is immediately visible on all other pages.

---

## 5. File Structure

```
medistock/
│
├── index.html          Dashboard overview with stat cards and alerts
├── inventory.html      Full medicine table with use/remove actions
├── add.html            Form to register new medicines and suppliers
├── alerts.html         Expiry-status table sorted by soonest date
├── suppliers.html      Supplier directory and purchase history
│
├── styles.css          All styling — shared across all pages
└── script.js           All logic — shared across all pages
```

No external frameworks, libraries, CDN scripts, or build tools are used. The project runs by opening `index.html` directly in any modern browser.

---

## 6. HTML Structure Explanation

### Semantic Tags Used

| Tag | Purpose |
|---|---|
| `<nav>` | Top navigation bar on every page |
| `<main>` | Primary page content area |
| `<section>` | Logical grouping of related content (e.g. a card) |
| `<aside>` | Sidebar on the Add Medicine page |
| `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>` | All data tables |
| `<form>`, `<label>`, `<input>` | Medicine entry form |
| `<footer>` | Shared page footer |
| `<strong>` | Emphasis inside modal dialogs |

### Navigation Bar

The navbar is implemented as a `<nav>` element containing an unordered list `<ul>` of anchor links. On mobile, a `<button>` with the id `navToggle` toggles the class `open` on the `<ul>`, which JavaScript and CSS use to show or hide the menu. The active page link receives the class `active` via JavaScript on load, using `window.location.pathname` to match filenames.

### Data Tables

All tables follow the same pattern: a `<table>` with `<thead>` for column headers and `<tbody>` populated entirely by JavaScript. This separation keeps HTML clean and makes the tables easy to re-render when data changes (e.g., after dispensing stock or removing a medicine).

### Form (Add Medicine)

The form uses `novalidate` on the `<form>` tag to suppress default browser validation and delegate all validation to JavaScript. Each `<input>` is paired with a `<span class="error-msg">` element that JavaScript populates when a field is invalid. This gives full control over when and how errors appear.

### Modal Dialogs

Two modal dialogs are used on the inventory page:
- **Confirm Remove** — warns before permanently deleting a medicine
- **Dispense Stock** — collects the quantity to subtract before confirming

Modals are `<div>` overlays positioned `fixed` at `inset: 0`. They are hidden by default and shown by toggling the class `modal-open` via JavaScript. Clicking the overlay background also closes them.

---

## 7. CSS Styling Explanation

### CSS Custom Properties (Variables)

All colours, spacing, typography, and shadow values are defined as CSS variables in `:root`. This makes the entire design consistent and easy to modify in one place.

```css
:root {
    --clr-primary:      #1a4785;   /* Navy – nav, buttons, brand */
    --clr-accent:       #0e8fa3;   /* Teal – links, use button, highlights */
    --clr-danger:       #b91c1c;   /* Red – expired, low stock, remove */
    --clr-warning:      #b45309;   /* Amber – near expiry, caution */
    --clr-success:      #166534;   /* Green – safe stock, adequate */
    --font-body:        'DM Sans'; /* Primary readable typeface */
    --font-mono:        'DM Mono'; /* Batch numbers, prices */
}
```

### Expiry Alert Colour Coding

Row-level colour coding is applied through three CSS classes added by JavaScript:

| Class | Background | Used For |
|---|---|---|
| `.row-expired` | Soft red `#fef2f2` | Medicines past expiry date |
| `.row-near-expiry` | Soft amber `#fffbeb` | Expiring within 30 days |
| `.row-safe` | White | More than 30 days remaining |

Status badges (`.badge--danger`, `.badge--warning`, `.badge--success`) use matching border and text colours without heavy backgrounds, keeping rows readable.

### Table Styling

Tables use `border-collapse: collapse` with no outer border. Row separators are applied via `border-bottom` on `<td>` elements only, giving a clean spreadsheet appearance. The `<thead>` row uses a slightly darker background (`--clr-surface-alt`) and uppercase, letter-spaced column headers to distinguish it clearly from data rows.

Hover highlighting is applied with:

```css
.data-table tbody tr:hover {
    background-color: #f8faff;
}
```

Each coloured row class has its own `:hover` override to darken slightly rather than replace the colour.

### Responsive Design

Three breakpoints are used:

- **`1024px`** — Dashboard grid and form layout switch from 2-column to 1-column
- **`768px`** — Navigation collapses to hamburger menu; stat cards stack vertically; form grid becomes single column
- **`480px`** — Font sizes and padding reduce; modal action buttons stack vertically

### Card Component

The `.card` class provides a white surface with a light border, subtle box shadow, and rounded corners. Every section of content — tables, alert lists, sidebar widgets — lives inside a card. This creates clear visual separation without heavy dividers.

---

## 8. JavaScript Functionality

All JavaScript lives in `script.js`. There are no classes or modules — the code uses plain functions and variables, appropriate for a second-year CS level and easy to trace and explain.

### Architecture

The script uses a **page router** pattern. On `DOMContentLoaded`, it reads `window.location.pathname` to determine which page is loaded, then calls the corresponding `init` function:

```
DOMContentLoaded
    └── getCurrentPage()
            ├── "index.html"      → initDashboard()
            ├── "inventory.html"  → initInventory()
            ├── "add.html"        → initAddMedicine()
            ├── "alerts.html"     → initAlerts()
            └── "suppliers.html"  → initSuppliers()
```

This means one script file serves all five pages without conflicts.

### Data Layer

Two `localStorage` keys store all application data:

| Key | Contents |
|---|---|
| `medistock_medicines` | JSON array of medicine objects |
| `medistock_suppliers` | JSON array of supplier contact objects |

If `localStorage` is empty (first run), the script seeds both with 10 default medicines and 3 default suppliers. A **migration function** inside `getMedicines()` detects old records missing `unitPrice`, `orderDate`, or `email` fields and backfills them from the seed data — ensuring backwards compatibility across versions.

### Key Functions

#### Stock Threshold Detection

```javascript
var LOW_STOCK_THRESHOLD = 20;

// Checks whether a medicine quantity is below the threshold
if (medicines[i].quantity <= LOW_STOCK_THRESHOLD) {
    lowStock++;
}
```

Any medicine at or below 20 units receives a "Low Stock" badge and bold quantity text in red.

#### Expiry Date Calculation

```javascript
function getExpiryStatus(expiryDateStr) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var expiry = new Date(expiryDateStr);
    var diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0)  return "expired";
    if (diffDays <= 30) return "near-expiry";
    return "safe";
}
```

The function normalises `today` to midnight to avoid time-of-day skewing the day count.

#### Dynamic Alert Display

The dashboard's low-stock panel and the alerts page table are both populated by JavaScript at page load — there is no static HTML for them. This means they always reflect the current state of `localStorage`, including any medicines just added or quantities just dispensed.

#### Form Validation

The Add Medicine form validates all eight fields before saving:

- Name, batch, supplier, contact, email — must be non-empty strings
- Quantity — must be a non-negative integer
- Unit price — must be a non-negative decimal number
- Expiry date and order date — must be selected

Errors display inline beneath each field. The form will not submit until all fields pass.

#### Live Cost Calculator

While filling in the Add Medicine form, the `updateCostPreview()` function listens to `input` events on the Quantity and Unit Price fields. On every keystroke it computes `quantity × unitPrice` and displays the result in a highlighted preview panel — giving instant visibility of the order cost before submitting.

#### Dispense / Use Stock

When a user clicks "Use" on an inventory row:
1. A modal opens showing the medicine name and current available quantity
2. The user enters how many units to dispense
3. JavaScript validates the input is a positive integer not exceeding available stock
4. The medicine's `quantity` is decremented in `localStorage`
5. The inventory table re-renders immediately — stock badge and totals update in place

#### Supplier Map (Dynamic Derivation)

Rather than maintaining a separate purchase history table, the `buildSupplierMap()` function derives all supplier data — medicines supplied, total inventory value, order count — directly from the medicines array at render time. This means adding a new medicine via the form automatically updates the Suppliers page with no extra steps.

---

## 9. Sample Data

The application ships with 10 pre-seeded medicines covering all three expiry statuses and multiple stock levels, giving immediate visual demonstration of all features.

| Medicine | Supplier | Qty | Unit Price | Status |
|---|---|---|---|---|
| Paracetamol 500mg | MedCorp Ltd | 250 | ₹0.90 | Safe |
| Amoxicillin 250mg | PharmaPlus | 15 | ₹1.87 | Near Expiry |
| Ibuprofen 400mg | MedCorp Ltd | 8 | ₹1.60 | Expired |
| Metformin 500mg | HealthDist Co | 180 | ₹1.25 | Safe |
| Atorvastatin 10mg | PharmaPlus | 5 | ₹4.20 | Expired |
| Omeprazole 20mg | HealthDist Co | 120 | ₹1.56 | Safe |
| Cetirizine 10mg | MedCorp Ltd | 3 | ₹1.20 | Expired |
| Aspirin 75mg | PharmaPlus | 200 | ₹0.70 | Safe |
| Lisinopril 5mg | MedCorp Ltd | 12 | ₹2.60 | Near Expiry |
| Amlodipine 5mg | HealthDist Co | 95 | ₹1.55 | Safe |

Three suppliers are pre-loaded:

| Supplier | Contact | Email |
|---|---|---|
| MedCorp Ltd | +91-98457-61230 | orders@medcorp.com |
| PharmaPlus | +91-70123-84567 | supply@pharmaplus.com |
| HealthDist Co | +91-63789-20145 | info@healthdist.com |

---

## 10. Program Output – Key Features

### Dashboard (`index.html`)
- Three summary cards showing total medicines, low-stock count, and expiry alert count — all computed live from data
- Recent inventory table showing the last 6 added medicines with stock status badges
- Low-stock alert panel listing all medicines below 20 units, ordered by quantity ascending

### Inventory (`inventory.html`)
- Complete medicine table with 9 columns including unit price and total stock value (₹)
- Row background colour reflects expiry status — red for expired, amber for near-expiry, white for safe
- "Low Stock" badge appears on any row with quantity ≤ 20, quantity displayed in red bold
- **Use** button opens dispense modal to subtract units from stock; table re-renders instantly
- **Remove** button opens confirmation modal before permanently deleting the record

### Add Medicine (`add.html`)
- Eight-field form split into Medicine Information and Supplier Information sections
- Order Date field defaults to today's date automatically on page load
- Live cost preview panel computes `quantity × unit price` in real time as fields are typed
- Inline validation errors appear beneath each field; form cannot submit until all pass
- Success banner confirms the medicine was saved; form resets with today's date pre-filled

### Expiry Alerts (`alerts.html`)
- Three summary cards counting expired, near-expiry, and safe medicines
- Colour key panel explains the red / amber / green coding
- All medicines sorted by expiry date (soonest first) — most urgent items appear at the top
- Days remaining column shows exact count; expired items show how many days ago they expired
- Remove button allows immediate removal of expired medicines

### Suppliers (`suppliers.html`)
- Summary cards show total suppliers, total medicine lines, and total inventory value in ₹
- Supplier directory table derived dynamically from medicine records — lists all medicines each supplier provides and their total stock value
- Purchase history table lists every medicine ordered, with order date, unit price, and total cost — sorted newest first
- Any new medicine added via the form immediately appears in this table with correct figures

---

## 11. How to Run

**No installation, server, or internet connection required.**

1. Download and unzip `medistock.zip`
2. Open the `medistock/` folder
3. Double-click `index.html` to open in any modern browser (Chrome, Firefox, Edge, Safari)
4. All data persists in the browser's `localStorage` across page refreshes

To reset all data to defaults, open the browser's Developer Tools → Application → Local Storage → clear all `medistock_*` keys, then refresh the page.

---

## 12. Project Demonstration Guide

The following sequence demonstrates all required features in a logical order during evaluation:

### Step 1 — Dashboard Overview
Open `index.html`. Point out the three stat cards and explain that all numbers are computed live from `localStorage`. Show the low-stock alert panel and explain the threshold logic (≤ 20 units).

### Step 2 — Inventory Table
Navigate to `inventory.html`. Demonstrate row colour coding — red rows are expired, amber rows are near-expiry. Click **Use** on any high-quantity medicine, enter a dispense quantity, and confirm. Show that the quantity and total value update instantly without a page reload. Point out the "Low Stock" badge appearing when quantity drops below 20.

### Step 3 — Add a New Medicine
Navigate to `add.html`. Show the Order Date already filled with today's date. Fill in the unit price and quantity fields and point out the live cost preview calculating in real time. Submit the form and show the success banner. Navigate back to Inventory to confirm the new row appears.

### Step 4 — Expiry Alerts
Navigate to `alerts.html`. Explain the sorting (soonest expiry at top). Point to expired rows and show the "X days ago" text in the Days Remaining column. Demonstrate removing an expired medicine and confirm it disappears from the table and the summary card count updates.

### Step 5 — Suppliers
Navigate to `suppliers.html`. Show that the supplier who supplied the medicine just added in Step 3 now appears (or their medicine count has grown). Explain that the purchase history is derived directly from medicine records — no data is hardcoded. Point out the total inventory value figure and explain the calculation (unit price × quantity, summed per supplier).

### Step 6 — Responsive Layout
Resize the browser window to mobile width. Show the hamburger menu, the collapsed stat cards, and the horizontally scrollable tables.
