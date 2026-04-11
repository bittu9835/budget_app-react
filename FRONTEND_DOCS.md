# Expense Tracker — Frontend Documentation

> **Stack:** React 18 · TypeScript · TailwindCSS · Dexie (IndexedDB) · Formik/Yup · Chart.js · Framer Motion  
> **Type:** Progressive Web App (PWA)  
> **Port:** `3000` (dev) | Built with Create React App PWA template

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Getting Started](#2-getting-started)
3. [Project Structure](#3-project-structure)
4. [Routing & Navigation](#4-routing--navigation)
5. [Authentication & MPIN](#5-authentication--mpin)
6. [State Management](#6-state-management)
7. [Offline-First Architecture](#7-offline-first-architecture)
8. [Theming System](#8-theming-system)
9. [Pages & Features](#9-pages--features)
   - [Dashboard](#91-dashboard)
   - [Transactions](#92-transactions)
   - [Add / Edit Transaction](#93-add--edit-transaction)
   - [Bank Accounts & Cards](#94-bank-accounts--cards)
   - [Khatabook (Ledger)](#95-khatabook-ledger)
   - [Calculator](#96-calculator)
   - [Settings](#97-settings)
10. [Services Layer](#10-services-layer)
11. [Common Components](#11-common-components)
12. [Environment Variables](#12-environment-variables)
13. [PWA & Offline Support](#13-pwa--offline-support)
14. [Known Issues & Limitations](#14-known-issues--limitations)

---

## 1. Project Overview

The Expense Tracker frontend is a **mobile-first PWA** that allows users to:

- Track income and expense transactions with categories and payment methods
- Manage bank accounts and credit cards with live balance updates
- View financial analytics via charts (bar, line, pie, doughnut)
- Manage a **Khatabook ledger** — credit/debit entries per customer
- Use a **built-in calculator** with history
- Work **completely offline** — data is stored in IndexedDB and synced to the backend when online
- Secure the app with a 4-digit **MPIN** (hashed locally, never sent to server)

---

## 2. Getting Started

```bash
# Navigate to frontend folder
cd budget_app-react

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Fill in:
#   REACT_APP_API_URL=http://localhost:4000/api
#   REACT_APP_GOOGLE_CLIENT_ID=<your_google_client_id>

# Start development server
npm start          # http://localhost:3000

# Production build
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

## 3. Project Structure

```
src/
├── App.tsx                     # Root: ToastContainer + Router
├── index.tsx                   # Entry: HashRouter, DataProvider, SW registration
├── db.ts                       # Dexie IndexedDB — 5 tables (v4 schema)
│
├── Context/
│   └── DataProvider.tsx        # Global React Context — all shared UI state
│
├── Home/
│   └── Home.tsx                # Authenticated layout shell
│                               #   SideNav (desktop) + TopNav + Outlet + BottomNav (mobile)
│                               #   + OfflineBanner + AddTransactions modal
│
├── Services/
│   ├── http/http.tsx           # Axios wrapper (auto-injects token header)
│   ├── transactionService.ts   # Transaction/account/category CRUD + sync
│   ├── khatabookService.ts     # Khatabook customer + ledger CRUD + sync
│   └── mpinUtils.ts            # MPIN SHA-256 hash utils (client-side only)
│
├── hooks/
│   └── useNetworkStatus.ts     # Online/offline polling + auto-sync trigger
│
├── Components/
│   ├── Auth/                   # SignIn, SignUp, MpinLogin, SetMpin, PinPad, GoogleLogin
│   ├── Router/Router.tsx       # All routes + guards
│   ├── Common/                 # Shared UI components (nav, charts, table, loader, etc.)
│   └── Pages/                  # Feature pages
│       ├── Dashboard/
│       ├── Transactions/
│       ├── AddTransactions/
│       ├── BankAccounts/
│       ├── Khatabook/
│       ├── Calculator/
│       ├── Investment/
│       └── Settings/
```

---

## 4. Routing & Navigation

### Route Table

| Path | Page | Guard |
|------|------|-------|
| `/` | Sign In | Public |
| `/signUp` | Sign Up | Public |
| `/setup-mpin` | Set MPIN | Logged in + MPIN not set |
| `/mpin` | MPIN Login | Logged in + MPIN set + not verified |
| `/home/dashBoard` | Dashboard | Authenticated |
| `/home/transactions` | Transactions | Authenticated |
| `/home/transactions/:filter` | Transactions (income/expence) | Authenticated |
| `/home/Card&Accounts` | Bank Accounts & Cards | Authenticated |
| `/home/calculator` | Calculator | Authenticated |
| `/home/investment` | Investment (placeholder) | Authenticated |
| `/home/settings` | Settings | Authenticated |
| `/home/khatabook` | Khatabook customer list | Authenticated |
| `/home/khatabook/:customerId` | Customer ledger detail | Authenticated |
| `*` | 404 Page | Public |

### Navigation Components

**SideNav** (desktop, `w-[15rem]`, hidden on mobile `hidden md:block`):
```
Dashboard · Cards & Accounts · Transactions · Investments · Calculator · Khatabook
```

**BottomNav** (mobile, `h-[7vh]`, `block md:hidden`):
```
Accounts | Khatabook | Dashboard | Settings | Ledger
```
- Flat 5-icon layout with small text labels
- No floating elevated button — all icons are equal height

---

## 5. Authentication & MPIN

### Standard Login Flow
1. User enters email + password → `POST /api/auth/login`
2. JWT token stored in `localStorage.token`
3. User details stored in `localStorage.userDetails`
4. `Home.tsx` checks `localStorage.token` on mount

### Google OAuth Flow
1. Google OAuth component returns credential
2. `POST /api/google/google_login` with credential
3. Same localStorage storage as above

### MPIN Flow
After login, two route guards enforce MPIN:

```
SetMpinGuard (/setup-mpin)
  → requires: token present, isMpinSet() = false
  → shows: 4-digit PIN creation + confirmation

MpinGuard (/mpin)
  → requires: token present, isMpinSet() = true, isMpinVerified() = false
  → shows: PIN entry screen
```

**mpinUtils.ts** — all MPIN logic is client-side:

| Function | Description |
|----------|-------------|
| `saveMpin(pin)` | SHA-256 hash PIN with email salt → `localStorage.mpinHash` |
| `verifyMpin(pin)` | Hash candidate, compare to stored hash |
| `isMpinSet()` | `localStorage.mpinHash` exists |
| `isMpinVerified()` | `sessionStorage.mpinVerified === 'true'` |
| `clearMpin()` | Remove `localStorage.mpinHash` |

> ⚠️ If the user clears localStorage, the MPIN is permanently lost — no server-side recovery.

---

## 6. State Management

All global UI state lives in `DataProvider.tsx` via React Context.

```typescript
// Access via:
const { render, setRender, openFotm, setOpenForm, ... } = useContext(DataContext);
```

| State | Type | Purpose |
|-------|------|---------|
| `render` | `boolean` | Toggle to trigger child re-fetches |
| `profileToggle` | `boolean` | Profile dropdown visibility |
| `theme` | `string` | Active CSS theme class (`'dark'` / `'light'`) |
| `openFotm` | `boolean` | Add Transaction modal open state *(note: typo — should be `openForm`)* |
| `transactionForEdit` | `any \| null` | Transaction data for edit mode |
| `selectedTransaction` | `any[]` | Rows selected for bulk delete |
| `accountForEdit` | `any \| null` | Account/card data for edit mode |
| `filterData` | `any` | Current filter values |
| `dbStatus` | `boolean` | Sync/online status |

> **Re-fetch pattern:** Pages call `setRender(!render)` after mutations to trigger their `useEffect`. This is an anti-pattern — a proper query invalidation system would be better.

---

## 7. Offline-First Architecture

### IndexedDB Schema (`db.ts`)

Uses **Dexie.js** as the IndexedDB wrapper. Current schema version: **v4**.

| Table | Key | Contents |
|-------|-----|----------|
| `transactions` | `id` | Expense/income transactions |
| `accounts` | `id` | Bank accounts and cards |
| `categories` | `id` | Income/expense categories |
| `khatabookCustomers` | `id` | Khatabook customer records |
| `khatabookTransactions` | `id` | Khatabook ledger entries |

Each record shape:
```typescript
{ id: string, data: any }  // id = MongoDB _id, data = full document
```

### Dual-Write Pattern

Every write operation follows this sequence:

```
1. Generate UUID   →  crypto.randomUUID() || fallback
2. Write IndexedDB →  db.table.add({ id, data: { ...payload, synced: false } })
                       ↑ instant, user sees result immediately
3. Try API call    →  http({ url, method, data }) — non-blocking, silent fail
4. On API success  →  db.table.update(id, { data: { ...payload, synced: true } })
```

If offline, step 3 fails silently. On next reconnect, `pushUnsyncedToServer()` retries all `synced: false` records.

### Sync Direction

| Direction | Function | When |
|-----------|----------|------|
| Server → Client | `syncFromServer()` / `syncKhatabookFromServer()` | App load, reconnect |
| Client → Server | `pushUnsyncedToServer()` / `pushUnsyncedKhatabookToServer()` | App load, reconnect |

**Conflict resolution:** Local `synced: false` records are never overwritten by server sync.

### Network Status Hook (`useNetworkStatus.ts`)

```typescript
const { isOnline, isSyncing, lastSyncTime, triggerSync } = useNetworkStatus(onSyncComplete);
```

- Polls `GET /ping` every **5 seconds**
- On offline → online transition: auto-triggers full sync
- Toast notifications on state changes

### Offline Banner (`OfflineBanner.tsx`)

Shown at top of `Home.tsx` layout:
- **Amber gradient** — when offline
- **Blue gradient with spinner** — when syncing
- Hides automatically when online and not syncing

---

## 8. Theming System

Themes are applied via a CSS class on the root layout `div` in `Home.tsx`:

```tsx
<div className={`${theme} w-screen h-screen ...`}>
```

Tailwind is extended with `skin-*` namespace that maps to CSS custom properties:

```javascript
// tailwind.config.js
textColor: { skin: { 'text': 'var(--color-text)', 'sideNav-text': 'var(--color-sideNav-text)', ... } }
backgroundColor: { skin: { 'bg-outlet': 'var(--color-bg-outlet)', ... } }
borderColor: { skin: { 'border': 'var(--color-border)', ... } }
```

### Usage in Components
```tsx
className="text-skin-text bg-skin-bg-outlet border-skin-border"
```

Or directly via inline style for gradients/dynamic values:
```tsx
style={{ background: 'var(--color-form-bg)', color: 'var(--color-text)' }}
```

### Theme Toggle
Settings → General → Dark Mode toggle calls `setTheme(theme === 'dark' ? 'light' : 'dark')`.

---

## 9. Pages & Features

### 9.1 Dashboard

**File:** `src/Components/Pages/Dashboard/Dashboars.tsx`

Reads all data from **IndexedDB only** — zero API calls. All stats computed client-side.

**Summary Cards (4):**
- Total Balance
- Income
- Expense (spelled "Expence" to match backend)
- Transaction Count

**Charts:**
- Bar chart: Monthly income vs expense (12 months)
- Area chart: Monthly balance trend
- Doughnut: Income by category
- Pie: Expense by category

**Filter:** Shared `Filter.tsx` component in compact mode. Supports: date range, action type, category, payment method.

---

### 9.2 Transactions

**File:** `src/Components/Pages/Transactions/Transactions.tsx`

- Reads from IndexedDB via `getAllTransactions(filters)`
- Client-side search: description, category, payment method
- Multi-checkbox selection for bulk delete
- Edit (single selection only)
- URL param `:filter` applies action filter (`income` | `expence`)
- Full `Filter.tsx` panel (date range, action, category, payment method)

---

### 9.3 Add / Edit Transaction

**Files:** `AddTransactions.tsx` + `AddTransaction2.tsx`

Two-step modal form:

**Step 1 — `AddTransactions.tsx`**
- Action (income / expence) radio
- Date picker (defaults to today)
- Amount input (₹ icon, color-coded: green=income, red=expense)
- Category dropdown + inline "Add New Category"
- Description textarea

**Step 2 — `AddTransaction2.tsx`**
- Payment method: Cash / Account / Card
- Conditional account/card dropdown (hidden for Cash)
- Submit / Cancel with loading spinner

**Data flow:**
```
Submit → transactionService.addTransaction(values)
       → IndexedDB.add()        [instant]
       → POST /api/transaction/addTransaction  [non-blocking]
       → setRender(!render)     [triggers parent refresh]
```

---

### 9.4 Bank Accounts & Cards

**Files:** `BankAccounts.tsx` + `BankAccountForm.tsx`

Two sections with different card designs:

| Section | Gradient | Special Fields |
|---------|----------|---------------|
| Bank Accounts | Brown/red gradient | IFSC code, branch location |
| Cards | Black gradient + chip + Visa | Expiry date, service provider |

- Edit/Delete appear on hover
- Loads from IndexedDB first, then refreshes from API
- Add/Edit via `BankAccountForm` modal (Formik + Yup)

---

### 9.5 Khatabook (Ledger)

**Files:** `Khatabook/` folder — 4 components

A **credit/debit ledger** for managing customer balances. Credit = money you will receive. Debit = money you will give.

#### Khatabook.tsx — Customer List

- **Summary banner**: Two gradient cards (green = total you'll get, red = total you'll give)
- **Search**: Real-time client-side filter by name or phone
- **Customer rows**: Rounded cards with gradient avatar badges
  - Green badge + "YOU'LL GET" = net positive
  - Red badge + "YOU'LL GIVE" = net negative  
  - Gray badge + "SETTLED" = zero balance
- Sort: by absolute net balance descending
- Hover: Edit + Delete buttons appear
- FAB button (purple gradient): opens `CustomerForm`

#### CustomerDetail.tsx — Ledger History

- **Gradient hero header**: full-width colored header (green/red/gray by net balance)
- Shows: name, phone, address, total credit, total debit, net balance
- Two action buttons: **Credit** (green) and **Debit** (red)
- Entry list: cards with left-colored border, arrow icon, note, date
- Hover: Delete button per entry

#### CustomerForm.tsx

- Bottom-sheet on mobile, centered modal on desktop
- Frosted glass backdrop (`blur(4px)`)
- Fields: Name*, Phone* (10-digit validation), Address (optional)
- Purple gradient submit button

#### LedgerForm.tsx

- Same modal pattern as CustomerForm
- Large `₹` amount input with color-coded border (green for credit, red for debit)
- Note (optional), Date (defaults to today)
- Submit button matches entry type color

#### Khatabook Data Flow
```
Add Customer      → khatabookService.addCustomer()
                  → db.khatabookCustomers.add()  [instant]
                  → POST /api/khatabook/create   [non-blocking]

Add Ledger Entry  → khatabookService.addLedgerEntry(customerId, type, amount, note, date)
                  → db.khatabookTransactions.add()  [instant]
                  → POST /api/khatabook/addEntry     [non-blocking]

Balance Display   → getCustomerSummary(customerId)
                  → reads IndexedDB, computes totalCredit/totalDebit/netBalance
```

#### API Endpoints (Khatabook)
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/khatabook/create` | Create customer |
| GET | `/api/khatabook/getCustomers` | All customers for user |
| PUT | `/api/khatabook/edit` | Update customer |
| DELETE | `/api/khatabook/delete` | Soft-delete customer + entries |
| POST | `/api/khatabook/addEntry` | Add ledger entry |
| GET | `/api/khatabook/getEntries` | Ledger entries (optionally by customerId) |
| DELETE | `/api/khatabook/deleteEntry` | Soft-delete entry |

---

### 9.6 Calculator

**File:** `src/Components/Pages/Calculator/Calculator.tsx`

A fully functional, keyboard-supported calculator.

**UI:**
- Dark gradient card (`#1a1a2e → #0f3460`)
- Expression display (secondary, small, shows full running expression)
- Result display (large, bold, dynamic font-size based on digit count)
- Operator buttons: purple gradient with glow shadow
- Equals button: green gradient
- Number buttons: frosted glass with border
- Function buttons (`AC`, `±`, `%`): light gray

**Keyboard Shortcuts:**
| Key | Action |
|-----|--------|
| `0–9` | Digit input |
| `+` | Add |
| `-` | Subtract |
| `*` | Multiply |
| `/` | Divide |
| `Enter` or `=` | Evaluate |
| `Escape` | All Clear |
| `Backspace` | Delete last digit |
| `%` | Percent |

**History Panel:**
- Toggle via clock icon (top-right of display)
- Stores last 20 calculations
- Click any entry to restore result
- "Clear history" button at bottom

**Expression Evaluator (`safeEval`):**
```typescript
// Replaces display chars: × → *, ÷ → /, − → -
// Whitelist: /^[\d+\-*/.() ]+$/
// Uses Function() for safe evaluation (no direct eval)
```

**Access routes:**
- SideNav → Calculator
- Settings → Tools → Calculator card

---

### 9.7 Settings

**File:** `src/Components/Pages/Settings/Settings.tsx`

Four sections (sidebar navigation on desktop, stacked on mobile):

#### Profile
Display-only name and email from `localStorage.userDetails`.

#### General
Dark mode toggle — calls `setTheme()` via DataContext.

#### Security — MPIN Management

State machine with 6 views:

| View | Description |
|------|-------------|
| `idle` | Shows current MPIN status (ON/OFF) + action buttons |
| `setup-create` | Enter new 4-digit PIN |
| `setup-confirm` | Re-enter to confirm |
| `change-verify` | Enter current PIN to verify |
| `change-create` | Enter new PIN |
| `change-confirm` | Confirm new PIN |

- Auto-submits when 4th digit is entered
- Error state: shakes, resets PIN field after 600ms
- Uses `PinPad` component (reusable dot display + numpad)

#### Tools
Quick navigation cards to:
- **Calculator** (`/home/calculator`) — purple gradient icon
- **Khatabook** (`/home/khatabook`) — teal gradient icon

Each card has: icon, title, description, animated arrow on hover.

---

## 10. Services Layer

### `http.tsx`

```typescript
http({
    url: '/transaction/addTransaction',  // relative to REACT_APP_API_URL
    method: 'post',
    data: { ... }
})
// Auto-adds: headers: { token: localStorage.getItem('token') }
// GET requests: data → params
// Other: data → body
```

### `transactionService.ts`

| Function | Description |
|----------|-------------|
| `getAllTransactions(filters?)` | Read + filter IndexedDB |
| `addTransaction(values)` | Dual-write |
| `editTransaction(id, values)` | Dual-write |
| `deleteTransactions(items)` | Soft-delete + dual-write |
| `syncFromServer()` | Pull server → IndexedDB (skip unsynced) |
| `pushUnsyncedToServer()` | Push `synced:false` → server |
| `addAccount(values)` | Dual-write |
| `editAccount(id, values)` | Dual-write |
| `deleteAccount(id)` | Dual-write |
| `getAllAccountsFromDB()` | Read IndexedDB |
| `getAllCategoriesFromDB()` | Read IndexedDB |
| `syncCategoriesFromServer()` | Pull categories from API |

### `khatabookService.ts`

See [Section 9.5](#95-khatabook-ledger) for full function list.

---

## 11. Common Components

### OfflineBanner
```tsx
<OfflineBanner isOnline={boolean} isSyncing={boolean} />
```
Shown at top of Home layout. Amber when offline, blue when syncing.

### Filter (`Transactions/Filter.tsx`)
```tsx
<Filter compact={boolean} onChange={(filters) => ...} />
```
Shared between Dashboard (compact) and Transactions (full):
- Date range: All Time / This Month / Last Month / Last 3M / Last 6M / This Year / Custom
- Action: All / Income / Expense
- Category: dynamic dropdown
- Payment: All / Cash / Account / Card

### Charts (`Common/Charts/`)
Wrappers around `react-chartjs-2`:
- `BarChart` — monthly income vs expense
- `AreaChart` — balance trend over time
- `PieChart` — expense by category
- `DoughnutChart` — income by category

### PinPad (`Auth/PinPad/PinPad.tsx`)
```tsx
<PinPad pin={string} onDigit={(d) => void} onDelete={() => void} error={boolean} />
```
- 4-dot display (filled/empty based on pin length)
- 12-button numpad (0-9, delete, submit)
- Error animation via `error` prop

---

## 12. Environment Variables

Create `budget_app-react/.env`:

```env
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_API_URL` | Yes | Backend base URL (without trailing slash after `/api`) |
| `REACT_APP_GOOGLE_CLIENT_ID` | Yes (for Google login) | OAuth client ID from Google Cloud Console |

---

## 13. PWA & Offline Support

The app is built as a PWA using CRA's PWA TypeScript template.

### What works offline
- View all transactions, accounts, Khatabook customers/entries (cached in IndexedDB)
- Add/edit/delete transactions (queued, synced on reconnect)
- Add/edit/delete Khatabook customers and entries (queued, synced on reconnect)
- Calculator (client-side only, always works)
- All authentication flows including MPIN (localStorage-based)

### What requires internet
- First login (auth token must be obtained from server)
- Fresh data sync (new data added on another device)

### Service Worker
Registered via `serviceWorkerRegistration.ts`. Handles static asset caching. **Does not** use the Background Sync API — sync is handled by the app-level polling hook.

### Installing as PWA
On mobile browsers → "Add to Home Screen". The `public/manifest.json` defines:
- App name, icons, theme color, background color
- `display: standalone` for native app look

---

## 14. Known Issues & Limitations

### Critical
| # | Issue | Location |
|---|-------|----------|
| 1 | Route guard is localStorage-only — any string bypasses auth | `Home.tsx` |
| 2 | "Forgot Password" link has no handler | `SignIn.tsx:106` |

### High Priority
| # | Issue | Location |
|---|-------|----------|
| 3 | Edit transaction may lose `id` from IndexedDB record shape | `AddTransactions.tsx` |
| 4 | Canonical spelling is `"expence"` — any `"expense"` breaks filters | Everywhere |
| 5 | Multiple `useEffect` with suppressed deps — stale closure risk | Various |

### Medium Priority
| # | Issue | Location |
|---|-------|----------|
| 6 | `openFotm` typo — should be `openForm` | `DataProvider.tsx` and all consumers |
| 7 | `any` types throughout — TypeScript barely enforced | All services and pages |
| 8 | `render` toggle anti-pattern for re-fetching | `DataProvider.tsx` |
| 9 | No error boundary — one crash kills the app | Root |
| 10 | `HashRouter` causes `#` in all URLs | `index.tsx` |
| 11 | MPIN stored only in localStorage — cleared on logout loses PIN | `mpinUtils.ts` |
| 12 | `jsonwebtoken` (Node.js lib) in browser bundle | `package.json` |
| 13 | `"i"` and `"npm"` accidentally in dependencies | `package.json` |

---

*Documentation generated for budget_app-react — April 2026*
