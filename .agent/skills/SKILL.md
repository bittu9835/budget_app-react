---
name: Budget App React Frontend
description: React + TypeScript + TailwindCSS PWA frontend for the Expense Tracker application. Contains codebase analysis, architecture, conventions, and known issues.
---

# Budget App React Frontend — Codebase Skill File

## Overview

This is a **React PWA (Progressive Web App)** built with **React 18**, **TypeScript**, **TailwindCSS**, **Formik + Yup**, **Chart.js**, and **Dexie (IndexedDB)**. It provides an expense tracking UI with dashboards, transaction management, bank account/card management, Khatabook ledger, MPIN security, a functional calculator, and offline-first support.

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
│   ├── db.ts                      # Dexie (IndexedDB) v4 — transactions, accounts, categories,
│   │                              #   khatabookCustomers, khatabookTransactions tables
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
│   │   ├── khatabookService.ts    # Khatabook dual-write service (customers + ledger entries)
│   │   └── mpinUtils.ts           # MPIN SHA-256 hashing, verification, session helpers
│   ├── hooks/
│   │   └── useNetworkStatus.ts    # Polling-based online/offline detection + sync trigger
│   ├── Components/
│   │   ├── Auth/
│   │   │   ├── SignIn/SignIn.tsx       # Login page (Formik + Yup)
│   │   │   ├── SignUp/SignUp.tsx       # Registration page
│   │   │   ├── MpinLogin/MpinLogin.tsx # MPIN verify screen
│   │   │   ├── SetMpin/SetMpin.tsx     # MPIN setup screen
│   │   │   ├── PinPad/PinPad.tsx       # Reusable 4-dot pin pad component
│   │   │   └── GoogleLogin.tsx         # Google OAuth button
│   │   ├── Router/
│   │   │   └── Router.tsx         # Route definitions + SetMpinGuard + MpinGuard
│   │   ├── Common/                # Reusable UI components
│   │   │   ├── BottomNav/BottonNav.tsx  # Mobile flat 5-icon nav with labels (no floating button)
│   │   │   ├── TopNav/TopNav.tsx        # Top navigation bar
│   │   │   ├── SideNav/SideNav.tsx      # Desktop side navigation (6 items incl. Khatabook)
│   │   │   ├── Profile/           # User profile dropdown
│   │   │   ├── Charts/            # Chart.js wrappers (Bar, Area, Pie, Doughnut)
│   │   │   ├── Table/             # Transaction data table
│   │   │   ├── InputComponent/    # Custom input dropdown
│   │   │   ├── Loader/            # Loading spinner overlay
│   │   │   ├── PageNoteFound/     # 404 page
│   │   │   ├── OfflineBanner/     # Network status banner (offline/syncing indicator)
│   │   │   └── Themes/            # Theme configuration (CSS variables)
│   │   └── Pages/
│   │       ├── Dashboard/         # Charts & summary cards (reads IndexedDB only)
│   │       ├── Transactions/      # Transaction list + Filter.tsx
│   │       ├── AddTransactions/   # Add/Edit modal — AddTransactions.tsx + AddTransaction2.tsx
│   │       ├── BankAccounts/      # Account/card management — BankAccounts.tsx + BankAccountForm.tsx
│   │       ├── Khatabook/         # Credit/debit ledger module
│   │       │   ├── Khatabook.tsx        # Customer list with gradient summary cards
│   │       │   ├── CustomerDetail.tsx   # Per-customer ledger history with gradient hero header
│   │       │   ├── CustomerForm.tsx     # Add/edit customer modal (bottom-sheet on mobile)
│   │       │   └── LedgerForm.tsx       # Credit/debit entry modal (color-coded by type)
│   │       ├── Calculator/
│   │       │   └── Calculator.tsx  # Fully functional calculator with history panel
│   │       ├── Investment/        # Investment tracking (placeholder)
│   │       └── Settings/
│   │           └── Settings.tsx   # Profile, General (dark mode), Security (MPIN), Tools section
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
| `/setup-mpin` | SetMpin | Yes (login + MPIN not set) | SetMpinGuard |
| `/mpin` | MpinLogin | Yes (login + MPIN set, not verified) | MpinGuard |
| `/home` | Home (layout) | Yes | localStorage token check |
| `/home/dashBoard` | Dashboard | Yes | |
| `/home/transactions` | Transactions | Yes | |
| `/home/transactions/:filter` | Transactions (filtered by action) | Yes | filter: income/expence |
| `/home/Card&Accounts` | BankAccounts | Yes | |
| `/home/calculator` | Calculator | Yes | |
| `/home/investment` | Investment | Yes | |
| `/home/settings` | Settings | Yes | |
| `/home/khatabook` | Khatabook | Yes | Customer list |
| `/home/khatabook/:customerId` | CustomerDetail | Yes | Per-customer ledger |
| `*` | PageNoteFound | No | |

### Route Guards
- **SetMpinGuard** (`/setup-mpin`): login required, MPIN not yet configured
- **MpinGuard** (`/mpin`): login required, MPIN set, not verified this session

---

## Navigation

### SideNav (desktop — `w-[15rem]`, hidden on mobile)
NavLinks: Dashboard | Cards & Accounts | Transactions | Investments | Calculator | Khatabook  
Active state: `text-skin-active-nav-text` (orange). Inactive: `text-skin-sideNav-text`.

### BottomNav (mobile only — `h-[7vh]`, flat 5-icon layout with labels)
Icons: Accounts | Khatabook | Dashboard | Settings | Ledger  
- **No floating/absolute-positioned button** — all 5 use `flex-1` equal spacing
- Each item shows icon + label, scales on active state
- Calculator removed from mobile nav (still accessible via SideNav on desktop and Settings → Tools)

---

## State Management (DataProvider.tsx)

| State | Purpose |
|-------|---------|
| `render` / `setRender` | Boolean toggle to trigger re-fetches |
| `profileToggle` | Show/hide profile dropdown |
| `theme` / `setTheme` | Current theme CSS class name |
| `openFotm` / `setOpenForm` | Add Transaction modal visibility (typo in name) |
| `transactionForEdit` | Transaction being edited (null = new) |
| `selectedTransaction` | Array of selected rows for bulk ops |
| `accountForEdit` | Bank account/card being edited |
| `filterData` | Current transaction filter value |
| `dbStatus` | Database connection/sync status |

---

## Offline-First Architecture

### Database (`db.ts`) — Dexie v4
Five IndexedDB tables:
| Table | Contents |
|-------|----------|
| `transactions` | All expense/income transactions |
| `accounts` | Bank accounts and cards |
| `categories` | Income/expense categories |
| `khatabookCustomers` | Khatabook customer records |
| `khatabookTransactions` | Khatabook ledger entries |

Each record: `{ id: string (MongoDB _id), data: any }`

### Dual-Write Pattern
1. **IndexedDB write first** — instant UI, works offline
2. **API call (non-blocking)** — fire-and-forget, silently fails offline
3. **`synced: true`** — set only after API confirms

### Sync Strategy
- `syncFromServer()` / `syncKhatabookFromServer()` — pull from API, merge (local unsynced NOT overwritten)
- `pushUnsyncedToServer()` / `pushUnsyncedKhatabookToServer()` — push all `synced: false` records
- Auto-triggered by `useNetworkStatus` on reconnect

---

## Services

### `transactionService.ts`
All transaction, account, and category CRUD + sync. Full dual-write. Used by Dashboard, Transactions, AddTransactions, BankAccounts.

### `khatabookService.ts`
| Function | Description |
|----------|-------------|
| `addCustomer(values)` | IndexedDB + POST `/khatabook/create` |
| `getCustomers()` | Read IndexedDB, exclude deleted |
| `editCustomer(id, values)` | IndexedDB + PUT `/khatabook/edit` |
| `deleteCustomer(id)` | Soft-delete customer + all their entries |
| `addLedgerEntry(customerId, type, amount, note, date)` | IndexedDB + POST `/khatabook/addEntry` |
| `getLedgerEntries(customerId)` | Filter IndexedDB by customerId, sort desc |
| `deleteLedgerEntry(id)` | Soft-delete entry |
| `getCustomerSummary(customerId)` | `{totalCredit, totalDebit, netBalance}` from IndexedDB |
| `getDashboardTotals()` | Total "you will get" + "you will give" across all customers |
| `syncKhatabookFromServer()` | Pull customers + entries from API → merge IndexedDB |
| `pushUnsyncedKhatabookToServer()` | Push unsynced records → API |

### `mpinUtils.ts`
SHA-256 PIN hashing with email salt. Client-side only, never sent to server.
`saveMpin` | `verifyMpin` | `isMpinSet` | `isMpinVerified` | `clearMpin`

### `http.tsx`
Axios wrapper. Auto-injects `token` header from localStorage. GET → `params`, others → `data`.

---

## Pages Detail

### Calculator (`Calculator.tsx`)
**Fully functional calculator with:**
- `safeEval()` — custom expression evaluator using `Function()` (no `eval`) with strict character whitelist
- Running expression display + large result display with dynamic font-size (shrinks for long numbers)
- Operator support: `÷ × − +` (display chars mapped to JS operators internally)
- Function keys: `AC` (all clear), `±` (negate), `%` (divide by 100), backspace
- **History panel**: last 20 calculations, click to restore result, clear history button
- **Keyboard support**: digits, `+`, `-` → `−`, `*` → `×`, `/` → `÷`, `Enter`/`=`, `Escape` → AC, `Backspace`
- Visual press feedback (scale-90 animation on tap)
- Dark gradient UI (`#1a1a2e → #0f3460`), operator buttons: purple gradient, `=`: green gradient
- "KEYBOARD SUPPORTED" hint text at bottom
- Accessible from: SideNav → Calculator, BottomNav (desktop only), Settings → Tools

### Khatabook (`Khatabook.tsx`)
- Gradient summary cards (green = You Will Get, red = You Will Give) with decorative arrow icons
- Customer list as rounded cards with gradient avatar badges (green/red/gray by net balance)
- Labels: "YOU'LL GET" (green) / "YOU'LL GIVE" (red) / "SETTLED" (gray)
- Client-side search by name or phone
- Hover-reveal Edit + Delete buttons per row
- FAB "Add Customer" button (purple gradient, `fixed bottom-20 md:bottom-6 right-5`)
- Sort: by absolute net balance descending

### CustomerDetail (`CustomerDetail.tsx`)
- Gradient hero header (green/red/gray based on net balance) with decorative circles
- Shows: customer name, phone, address, total credit, total debit, net balance
- Credit/Debit action buttons (green/red gradients, scale on hover)
- Ledger entry list: left-colored border cards (green=credit, red=debit), hover-reveal delete
- Entries sorted newest first

### CustomerForm / LedgerForm (modals)
- **Bottom-sheet on mobile** (`items-end`), **centered on desktop** (`sm:items-center`)
- `backdrop-filter: blur(4px)` frosted glass overlay
- Rounded `rounded-xl` input fields with colored focus borders
- LedgerForm: large `₹` amount input color-coded by type (green/red), gradient top accent bar
- CustomerForm: purple gradient submit button

### Settings (`Settings.tsx`)
Four sections: Profile | General | Security | **Tools**
- **Tools section**: cards linking to Calculator (`/home/calculator`) and Khatabook (`/home/khatabook`) with icons, descriptions, and animated arrow on hover. Uses `useNavigate`.
- **General**: Dark mode toggle
- **Security**: Full MPIN setup/change/remove with PinPad component

---

## Theming System

CSS custom properties with Tailwind `skin-*` classes. Theme applied via CSS class on root layout div.

### CSS Variables Required per Theme
```css
/* Text */
--color-text, --color-logo, --color-text-dashboard, --color-sideNav-text,
--color-active-nav-text, --color-topNav-text, --color-topNav-secondery-text,
--color-profile-text, --color-profile-text-hover, --color-profile-secondery-text,
--color-table-head-text, --color-table-hover, --color-button-text,
--color-form-text, --color-form-label-text

/* Background */
--color-bg-color, --color-bg-outlet, --color-bg-dashboard, --color-bg-sideNav,
--color-bg-topNav, --color-bg-profile, --color-table-head-bg, --color-table-hover,
--color-table, --color-button-bg, --color-button-hover, --color-button-muted,
--color-form-bg, --color-loader-bg

/* Border */
--color-border, --color-loader-border, --color-table-border,
--color-profile-border-hover, --color-profile-border
```

---

## Authentication Flow

1. **SignIn** → POST `/api/auth/login` → JWT in `localStorage.token` + user in `localStorage.userDetails`
2. **SignUp** → POST `/api/user/addUser` → redirect to sign in
3. **Google Login** → POST `/api/google/google_login` → JWT + user stored
4. **MPIN Setup** → SetMpinGuard redirects to `/setup-mpin` after first login
5. **MPIN Verify** → MpinGuard redirects to `/mpin` on each session until verified
6. **Route Protection** → `Home.tsx` checks `localStorage.token`

---

## 🚨 Known Issues

### Critical
1. **Route protection client-side only** — any string in `localStorage.token` bypasses auth
2. **"Forgot Password" non-functional** — `<p>` tag with no handler

### High Priority
3. **`editTransaction` ID** — `transactionForEdit?.id` may be missing if IndexedDB record shape is `{id, data}` and only `data` is set as edit target
4. **Spelling: `expence` vs `expense`** — canonical is `"expence"` throughout; any new code using `"expense"` breaks filtering
5. **`bg2` unused import** in `SignUp.tsx`
6. **Multiple `eslint-disable-next-line`** on useEffect deps — risk of stale closures

### Medium Priority
7. **Excessive `any` types** — most state and API response types are `any`
8. **`openFotm` typo** — used everywhere, should be `openForm`
9. **`render` toggle anti-pattern** — `setRender(!render)` to force re-fetch is fragile
10. **No error boundary** — component crash takes down entire app
11. **`HashRouter`** instead of `BrowserRouter` — `#` in URLs hurts SEO
12. **`jsonwebtoken` in frontend deps** — Node.js library in browser bundle
13. **`i` and `npm` accidentally installed** as dependencies
14. **MPIN client-side only** — localStorage clear loses PIN with no recovery

---

## How to Run

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Environment variables required in .env:
# REACT_APP_API_URL=http://localhost:4000/api
# REACT_APP_GOOGLE_CLIENT_ID=<google_oauth_client_id>
```

---

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.2.0 | UI framework |
| react-router-dom | 6.16.0 | Routing (HashRouter) |
| axios | 1.5.1 | HTTP client |
| formik | 2.4.5 | Form management |
| yup | 1.3.2 | Schema validation |
| chart.js | 4.4.0 | Charts |
| react-chartjs-2 | 5.2.0 | Chart.js React wrapper |
| tailwindcss | 3.3.3 | CSS framework |
| framer-motion | 10.16.4 | Animations |
| react-toastify | 9.1.3 | Toast notifications |
| dexie | 4.0.11 | IndexedDB wrapper |
| react-icons | 4.11.0 | Icon library |
| moment | 2.29.4 | Date formatting |
| @react-oauth/google | 0.12.1 | Google OAuth |
| react-loader-spinner | 5.4.5 | Loading spinners |

---

## PWA Features

- Service worker registered via `serviceWorkerRegistration.ts`
- Offline storage with Dexie/IndexedDB (v4 — 5 tables)
- Full transaction + Khatabook CRUD works offline
- [x] Dual-write (IndexedDB first, API non-blocking)
- [x] Auto-sync on reconnect (`useNetworkStatus` polling every 5s)
- [x] Offline banner + syncing spinner
- [x] Dashboard fully offline (reads IndexedDB, zero API calls)
- [x] Khatabook fully offline (same dual-write pattern)
- [ ] Service worker background sync (relies on polling, not SW Background Sync API)
