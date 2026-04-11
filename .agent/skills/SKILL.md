---
name: Budget App React Frontend
description: React + TypeScript + TailwindCSS PWA frontend for the Expense Tracker application. Contains codebase analysis, architecture, conventions, and known issues.
---

# Budget App React Frontend — Codebase Skill File

## Overview

This is a **React PWA (Progressive Web App)** built with **React 18**, **TypeScript**, **TailwindCSS**, **Formik + Yup**, **Chart.js**, and **Dexie (IndexedDB)**. It provides an expense tracking UI with dashboards, transaction management, bank account/card management, MPIN security, and offline-first support.

**Created with:** Create React App (PWA TypeScript template)  
**Port:** 3000 (default)  
**Backend API:** Configured via `.env` → `REACT_APP_API_URL`

---

## Architecture & File Structure

```
budget_app-react/
├── public/                        # Static assets, manifest, service worker
├── src/
│   ├── App.tsx                    # Root app — Router + Toast container
│   ├── index.tsx                  # Entry point — React root, HashRouter, DataProvider, SW registration
│   ├── db.ts                      # Dexie (IndexedDB) database setup — transactions, accounts, categories tables
│   ├── App.css                    # Global styles
│   ├── index.css                  # Tailwind imports + CSS custom properties (theming)
│   ├── service-worker.ts          # CRA PWA service worker
│   ├── serviceWorkerRegistration.ts
│   ├── Assets/                    # Static images (login bg, icons, chip, Visa logo, etc.)
│   ├── Context/
│   │   └── DataProvider.tsx       # Global React Context (state management)
│   ├── Home/
│   │   └── Home.tsx               # Main layout — SideNav, TopNav, BottomNav, OfflineBanner, Outlet
│   ├── Services/
│   │   ├── http/
│   │   │   └── http.tsx           # Axios HTTP client wrapper
│   │   ├── transactionService.ts  # Dual-write service (IndexedDB + API), sync logic
│   │   └── mpinUtils.ts           # MPIN hashing, verification, session helpers
│   ├── hooks/
│   │   └── useNetworkStatus.ts    # Polling-based online/offline detection + sync trigger
│   ├── Components/
│   │   ├── Auth/
│   │   │   ├── SignIn/SignIn.tsx   # Login page (Formik + Yup validation)
│   │   │   ├── SignUp/SignUp.tsx   # Registration page
│   │   │   └── GoogleLogin.tsx    # Google OAuth button
│   │   ├── Router/
│   │   │   └── Router.tsx         # Route definitions + SetMpinGuard + MpinGuard
│   │   ├── Common/                # Reusable UI components
│   │   │   ├── BottomNav/         # Mobile bottom navigation
│   │   │   ├── TopNav/            # Top navigation bar
│   │   │   ├── SideNav/           # Desktop side navigation
│   │   │   ├── Profile/           # User profile dropdown
│   │   │   ├── Charts/            # Chart.js wrappers (Bar, Area, Pie, Doughnut)
│   │   │   ├── Table/             # Transaction data table
│   │   │   ├── InputComponent/    # Custom input dropdown
│   │   │   ├── Loader/            # Loading spinner overlay
│   │   │   ├── PageNoteFound/     # 404 page
│   │   │   ├── OfflineBanner/     # Network status banner (offline/syncing indicator)
│   │   │   └── Themes/            # Theme configuration (CSS variables)
│   │   └── Pages/
│   │       ├── Dashboard/         # Main dashboard with charts & summary cards (reads IndexedDB)
│   │       ├── Transactions/      # Transaction list with search, filter, edit, bulk delete
│   │       │   └── Filter.tsx     # Comprehensive filter panel (date, action, category, payment)
│   │       ├── AddTransactions/   # Add/Edit transaction modal form
│   │       │   ├── AddTransactions.tsx  # Step 1 — category, amount, description
│   │       │   └── AddTransaction2.tsx  # Step 2 — payment method, account/card selection
│   │       ├── BankAccounts/      # Bank account & credit card management
│   │       │   ├── BankAccounts.tsx     # Account/card list display
│   │       │   └── BankAccountForm.tsx  # Add/Edit modal form
│   │       ├── Calculator/        # Calculator feature
│   │       ├── Investment/        # Investment tracking (placeholder)
│   │       └── Settings/          # Profile, General (dark mode), Security (MPIN)
├── tailwind.config.js             # Tailwind with custom skin/theme tokens
├── .env                           # API URL + Google Client ID
├── package.json
└── tsconfig.json
```

---

## Routes

| Path | Component | Auth Required? | Notes |
|------|-----------|----------------|-------|
| `/` | SignIn | No | |
| `/signUp` | SignUp | No | |
| `/setup-mpin` | SetMpin | Yes (login required, MPIN not yet set) | SetMpinGuard |
| `/mpin` | MpinLogin | Yes (login required, MPIN set, not verified) | MpinGuard |
| `/home` | Home (layout) | Yes | localStorage token check |
| `/home/dashBoard` | Dashboard | Yes | |
| `/home/transactions` | Transactions | Yes | |
| `/home/transactions/:filter` | Transactions (filtered by action) | Yes | filter param: income/expence |
| `/home/Card&Accounts` | BankAccounts | Yes | |
| `/home/calculator` | Calculator | Yes | |
| `/home/investment` | Investment | Yes | |
| `/home/settings` | Settings | Yes | |
| `*` | PageNoteFound | No | |

### Route Guards

- **SetMpinGuard**: If logged in but MPIN is not configured → redirect to `/setup-mpin`
- **MpinGuard**: If logged in, MPIN is set, but not yet verified this session → redirect to `/mpin`
- These guards wrap all `/home/*` routes for MPIN enforcement

---

## State Management

Uses **React Context** (`DataProvider.tsx`) with the following global state:

| State | Purpose |
|-------|---------|
| `render` / `setRender` | Boolean toggle to trigger re-fetches |
| `profileToggle` | Show/hide profile dropdown |
| `theme` / `setTheme` | Current theme CSS class name |
| `openFotm` / `setOpenForm` | Show/hide the Add Transaction modal (note: typo in name) |
| `transactionForEdit` | Transaction being edited (null = new) |
| `selectedTransaction` | Array of selected transactions for bulk edit/delete |
| `accountForEdit` | Bank account/card being edited |
| `filterData` | Current transaction filter value |
| `dbStatus` | Database connection status |

---

## Offline-First Architecture

The app is built around an **IndexedDB-first** data layer using **Dexie.js**.

### Database (`db.ts`)
- Three Dexie tables: `transactions`, `accounts`, `categories`
- Schema versioned (v1 → v2 → v3)
- Each record shape: `{ id: string (MongoDB _id), data: object }`

### Dual-Write Pattern (`transactionService.ts`)
1. **Write to IndexedDB immediately** — instant UI feedback, works offline
2. **Attempt API call** — non-blocking, silently fails if offline
3. **Mark `synced: true`** — only after API succeeds

### Sync Strategy (`transactionService.ts`)
- `syncFromServer()`: Pulls all transactions, accounts, categories from API; merges intelligently (local unsynced items are NOT overwritten)
- `pushUnsyncedToServer()`: Pushes all records with `synced: false` to the API
- **Conflict resolution**: Local unsynced data takes precedence over server data

### Network Status (`useNetworkStatus.ts`)
- Polls backend `/ping` every 5 seconds
- Detects online ↔ offline transitions
- Auto-triggers `syncFromServer()` + `pushUnsyncedToServer()` when reconnecting
- Returns: `{ isOnline, isSyncing, lastSyncTime, triggerSync }`
- Toast notifications on status changes

### Offline Banner (`OfflineBanner.tsx`)
- Amber/orange gradient banner when offline
- Blue/cyan gradient with spinner when syncing
- Automatically hides when online and sync is complete

---

## Services

### `transactionService.ts`
Core data access layer. All pages use this instead of calling API directly.

**Interfaces:**
- `TransactionData` — full transaction shape
- `TransactionFilters` — date range, action, category, paymentMethod, search
- `DashboardStats` — summary totals, chart data arrays

**Functions:**
| Function | Description |
|----------|-------------|
| `getAllTransactions(filters?)` | Reads IndexedDB, applies filters locally |
| `addTransaction(values)` | IndexedDB write + API (non-blocking) |
| `editTransaction(id, values)` | IndexedDB update + API |
| `deleteTransactions(items)` | Soft delete in IndexedDB + API |
| `syncFromServer()` | Pull server data → merge into IndexedDB |
| `pushUnsyncedToServer()` | Push unsynced IndexedDB records → API |
| `addAccount(values)` | Create account in IndexedDB + API |
| `editAccount(id, values)` | Update account in IndexedDB + API |
| `deleteAccount(id)` | Remove account from IndexedDB + API |
| `getAllAccountsFromDB()` | Read all accounts from IndexedDB |
| `getAllCategoriesFromDB()` | Read all categories from IndexedDB |
| `syncCategoriesFromServer()` | Pull categories from API → IndexedDB |

### `mpinUtils.ts`
Client-side MPIN security. Never sends PIN to server.

| Function | Description |
|----------|-------------|
| `saveMpin(pin)` | SHA-256 hash with email salt, store in localStorage |
| `verifyMpin(pin)` | Hash candidate PIN, compare to stored hash |
| `isMpinSet()` | Check if MPIN hash exists in localStorage |
| `isMpinVerified()` | Check if current session has verified the MPIN |
| `clearMpin()` | Remove all MPIN data from localStorage |

### `http.tsx`
- Wraps Axios with automatic token injection
- Reads `token` from `localStorage`, sets as custom `token` header
- GET requests: data passed as `params`; others: as request body

---

## Pages Detail

### Dashboard
- Reads ALL transactions from IndexedDB via `transactionService`
- Computes all stats client-side (no API calls for charts)
- 4 summary cards: Total Balance, Income, Expense, Transaction Count
- Bar chart: Monthly income vs expense (last 12 months)
- Area chart: Monthly balance trend
- Doughnut chart: Income by category
- Pie chart: Expense by category
- Integrated FilterBar (compact mode)

### Transactions
- Table display with search (client-side, on IndexedDB data)
- Multi-select checkboxes for bulk operations
- Bulk delete with confirmation
- Single-select opens edit modal
- URL param `:filter` applies action filter (income/expence)
- Integrated FilterBar (full mode)

### Filter (`Filter.tsx`)
Shared between Dashboard and Transactions:
- **Date range**: All Time, This Month, Last Month, Last 3/6 Months, This Year, Custom
- **Action**: All / Income / Expense toggles
- **Category**: Dropdown populated from transaction data
- **Payment method**: All / Cash / Account / Card
- Clear filters button
- Compact mode (Dashboard) vs full mode (Transactions)

### AddTransactions (2-step form)
**Step 1 (`AddTransactions.tsx`):**
- Action radio: income / expence
- Date picker
- Amount input (color-coded rupee icon: green=income, red=expense)
- Category dropdown + inline "Add Category" creation
- Description textarea

**Step 2 (`AddTransaction2.tsx`):**
- Payment method selector: Cash / Account / Card
- Conditional account/card dropdown (only shown for Account/Card)
- Link to BankAccounts page to add new accounts
- Submit and Cancel buttons with loading state

### BankAccounts
- Two sections: Bank Accounts and Cards
- Card-style display:
  - Bank accounts: brown gradient
  - Cards: black gradient with chip image + Visa logo
- Edit/Delete on hover
- Loads from IndexedDB cache first, then refreshes from API
- No-data empty states with add prompts

### BankAccountForm
- Modal for add/edit of accounts and cards
- Conditional fields:
  - **Bank**: IFSC code, branch location
  - **Card**: Expiry date, service provider
  - **Both**: Name, number (last 4 digits), account holder name
- Validation: 4-digit numbers, IFSC format
- Dual write: IndexedDB + API

### Settings
Three sections:
1. **Profile**: Display-only name and email from localStorage
2. **General**: Dark mode toggle (applies theme CSS class)
3. **Security** (MPIN management):
   - Setup flow: Enter 4-digit PIN → Confirm PIN
   - Change flow: Verify current → Enter new → Confirm new
   - Remove MPIN option
   - PinPad component with visual dot feedback
   - Auto-submits after 4 digits entered
   - Uses `mpinUtils` functions exclusively

---

## Theming System

- CSS custom properties with Tailwind `skin-*` utility classes
- Theme applied via CSS class on root layout div (e.g., `dark-theme`, `light-theme`)
- Dark mode toggled from Settings page

### CSS Variables Required per Theme
```css
/* Text */
--color-text, --color-logo, --color-text-dashboard,
--color-sideNav-text, --color-active-nav-text,
--color-topNav-text, --color-topNav-secondery-text,
--color-profile-text, --color-profile-text-hover,
--color-profile-secondery-text, --color-table-head-text,
--color-table-hover, --color-button-text,
--color-form-text, --color-form-label-text

/* Background */
--color-bg-color, --color-bg-outlet, --color-bg-dashboard,
--color-bg-sideNav, --color-bg-topNav, --color-bg-profile,
--color-table-head-bg, --color-table-hover, --color-table,
--color-button-bg, --color-button-hover, --color-button-muted,
--color-form-bg, --color-loader-bg

/* Border */
--color-border, --color-loader-border, --color-table-border,
--color-profile-border-hover, --color-profile-border
```

---

## Authentication Flow

1. **SignIn:** Email/password via Formik → POST `/api/auth/login` → JWT in `localStorage.token` + user in `localStorage.userDetails`
2. **SignUp:** Name/email/password → POST `/api/user/addUser` → redirect to sign in
3. **Google Login:** Google OAuth response → POST `/api/google/google_login` → JWT + user stored
4. **MPIN Setup:** After first login, user is prompted to set 4-digit MPIN (enforced by SetMpinGuard)
5. **MPIN Verify:** Returning session verifies PIN before accessing home routes (MpinGuard)
6. **Route Protection:** `Home.tsx` checks `localStorage.token` → redirects to `/` if missing

---

## 🚨 KNOWN ISSUES & BUGS

### Critical

1. **🔴 Route protection is client-side only and easily bypassed**
   - `Home.tsx` just checks if `localStorage.token` exists
   - No token validation or expiry check
   - Any string as `token` in localStorage bypasses auth

2. **🔴 "Forgot Password" link is non-functional** (`SignIn.tsx` line 106) — just a `<p>` tag with no handler or route

### High Priority

3. **🟡 `editTransaction` ID passing** — After editing, `transactionForEdit?.id` is used but the object retrieved from IndexedDB is `{id, data}` — only `transaction.data` is set as the edit target, so `id` may not be present on the payload

4. **🟡 Spelling inconsistency:** `expence` vs `expense` — The entire codebase uses `expence` (matching backend), but any new code accidentally using `expense` will break filtering

5. **🟡 `bg2` import in SignUp is unused** (`SignUp.tsx` line 4) — dead import

6. **🟡 Multiple `useEffect` with `eslint-disable-next-line`** — Suppressed dependencies can cause stale closures

### Medium Priority

7. **🟠 Excessive `any` types throughout** — State variables, API responses, function params mostly typed as `any`

8. **🟠 `openFotm` typo** — Used everywhere in Context, DataProvider, Home.tsx, AddTransactions. Should be `openForm`

9. **🟠 `render` state toggle anti-pattern** — `setRender(!render)` to trigger `useEffect` re-runs is fragile

10. **🟠 No proper error boundary** — Component crash takes down the entire app

11. **🟠 `HashRouter` instead of `BrowserRouter`** — `#` in URLs hurts SEO

12. **🟠 `jsonwebtoken` in frontend dependencies** — Node.js-only library, should not be in browser bundle

13. **🟠 `i` and `npm` in dependencies** — Accidentally installed (`"i": "^0.3.7"`, `"npm": "^10.2.0"`)

14. **🟠 `@syncfusion/ej2-dropdowns` imported** — Heavy enterprise library, may be unused

15. **🟠 MPIN is client-side only** — SHA-256 hashed locally with email salt. If localStorage is cleared, MPIN is lost with no recovery mechanism

---

## How to Run

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy

# Environment variables required in .env:
# REACT_APP_API_URL=http://localhost:4000/api
# REACT_APP_GOOGLE_CLIENT_ID=<google_oauth_client_id>
```

---

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.2.0 | UI framework |
| react-router-dom | 6.16.0 | Client-side routing (HashRouter) |
| axios | 1.5.1 | HTTP client |
| formik | 2.4.5 | Form management |
| yup | 1.3.2 | Schema validation |
| chart.js | 4.4.0 | Charts |
| react-chartjs-2 | 5.2.0 | Chart.js React wrapper |
| tailwindcss | 3.3.3 | CSS framework |
| framer-motion | 10.16.4 | Animations |
| react-toastify | 9.1.3 | Toast notifications |
| dexie | 4.0.11 | IndexedDB wrapper (offline storage) |
| react-icons | 4.11.0 | Icon library |
| moment | 2.29.4 | Date formatting |
| @react-oauth/google | 0.12.1 | Google OAuth |
| react-loader-spinner | 5.4.5 | Loading spinners |

---

## PWA Features

- Service worker registered (`serviceWorkerRegistration.ts`)
- Offline storage with Dexie/IndexedDB
- Full transaction CRUD works offline
- [x] Dual-write pattern (IndexedDB first, API non-blocking)
- [x] Auto-sync on reconnect (via `useNetworkStatus` polling)
- [x] Offline banner visual indicator
- [x] Dashboard fully offline (reads IndexedDB, no API calls)
- [ ] Background sync via service worker (not implemented — relies on polling)
- [ ] Offline cache strategies for static assets
