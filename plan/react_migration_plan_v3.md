# React Migration Plan v3: พุงกาง Restaurant Platform

This document serves as the master blueprint for migrating the existing HTML/JS platform into a production-grade React SPA. It incorporates granular UI specifications, a centralized status system, and advanced architectural patterns.

---

## 1. Existing Project Analysis

### 1.1 Project Overview
- **Technology Stack:** HTML5, Tailwind CSS (via CDN), Vanilla JavaScript.
- **Primary Design Pattern:** Dashboard layout with a fixed sidebar and a header.
- **Target Platform:** Web (Responsive, includes mobile-specific adjustments).
- **Architecture:** Multi-page application (MPA) transitioning to a Single Page Application (SPA).

### 1.2 Global UI/UX Elements & Color Palette
| Element | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Main Background** | `#E4E7EC` | Page background |
| **Sidebar Background** | `#E8EBF0` | Navigation menu background |
| **Primary Text** | `#1A2333` | Headings, active menu text, main content |
| **Secondary Text** | `#6B7A8D` | Subheadings, icons, inactive menu text |
| **Tertiary Text** | `#9AA3AE` | Section labels, timestamps, hints |
| **Border Color** | `#C8CDD6` | Cards, sidebar, and header borders |
| **Inner Border** | `#E8EBF0` | Dividers within cards and popups |
| **Active/Hover State** | `#D6DBE4` | Selected menu items, button hovers |
| **Active Border** | `#B4BAC4` | Border of the active period selector button |
| **Success/Positive** | `#1D9E75` | Revenue increase, active status |
| **Success Background** | `#E1F5EE` | Ready badge background |
| **Success Text** | `#0F6E56` | Ready badge text |
| **Danger/Alert** | `#E24B4A` | Revenue decrease, notifications, waste |
| **Danger Background** | `#FCEBEB` | Low stock badge background |
| **Warning Background** | `#FEF3E2` | Cooking status background |
| **Warning Text** | `#C96A00` | Cooking status text |
| **Dark Neutral** | `#3D4A5C` | AI widget header, send button, highest bar |

### 1.3 Status Badge System (Centralized)
To be implemented in `src/utils/statusStyles.ts`.
- **Orders:** 
  - `New`: bg `#D0D5DE`, text `#1A2333`
  - `Cooking`: bg `#FEF3E2`, text `#C96A00`
  - `Ready`: bg `#E1F5EE`, text `#0F6E56`
  - `Paid`: bg `#D6DBE4`, text `#1A2333`
- **Stock:**
  - `Empty`: bg `#F9FAFB`, border `#E8EBF0`, text `#9AA3AE`
  - `Low`: bg `#FCEBEB`, text `#E24B4A`
  - `Exp Soon`: bg `#FEF3E2`, text `#C96A00`
- **Table Dots:** `Available` (#1D9E75), `Occupied` (#C96A00), `Reserved` (#E24B4A).

---

## 2. Recommended Tech Stack

- **Framework:** React 18+ (TypeScript)
- **Data Fetching:** TanStack Query (Server state, caching, retries)
- **Global UI State:** Zustand (Sidebar, Popups, Notifications)
- **Local Complex State:** React Context + `useReducer` (Waste Log Grid)
- **Styling:** Tailwind CSS (Local PostCSS setup)
- **API Mocking:** MSW (Mock Service Worker) for parallel dev
- **Testing:** Vitest + React Testing Library

---

## 3. Folder Structure
```text
src/
├── api/             # Typed axios wrappers (orders.ts, stock.ts, etc.)
├── assets/          # global.css
├── components/      # Atomic design approach
│   ├── layout/      # Sidebar, Header, AIWidget
│   ├── common/      # Badge, Button, Modal, Table (Reusable)
│   ├── dashboard/   # StatCard, RevenueChart
│   └── inventory/   # StockTable, WasteGrid
├── hooks/           # useOrders, useClickOutside, useAutoResize
├── pages/           # Dashboard, Tables, Orders, Menu, etc.
├── store/           # useUIStore, useAuthStore, useNotificationStore
├── providers/       # AuthProvider, AIContextProvider, WasteFormProvider
├── utils/           # formatTHB, statusStyles, ROLE_PERMISSIONS
└── __tests__/       # format.test.ts, component tests
```

---

## 4. Page-Specific Migration Notes (Extremely Detailed)

### 4.1 Dashboard
- **State:** `period`: 'today' | 'week' | 'month' (default: 'week').
- **Chart:** Recharts BarChart. Logic: `bars.map(b => b.value === maxValue ? '#3D4A5C' : '#D0D5DE')`.
- **Stat Cards:** Clickable cards (Orders, Tables) use `Link`. Non-clickable (Revenue, AOV).
- **Sub-sections:** Stock Alerts and Recent Waste are lightweight `useQuery` calls, acting as entry points to full pages.

### 4.2 Tables (โต๊ะ)
- **Filter:** 'all' | 'available' | 'occupied' | 'reserved'.
- **Component:** `TableCard` displays dot color, seat count, and elapsed time.
- **Interaction:** Clicking opens `TableDetailModal` to manage status or view current bill.

### 4.3 Orders (ออเดอร์)
- **Layout (Min-Widths):**
  - Order ID: `min-w-[40px]`
  - Item Summary: `flex-1 truncate`
  - Status Badge: `min-w-[58px] text-center`
  - Elapsed Time: `min-w-[38px] text-right`
- **Optimistic Updates:** When clicking "Accept", status jumps to `Cooking` locally via TanStack Query `onMutate`.
- **Live Badge:** Sidebar badge computes count: `orders.filter(o => ['New', 'Cooking'].includes(o.status)).length`.

### 4.4 Menu (เมนู)
- **Dynamic Tabs:** `[...new Set(menuItems.map(i => i.category))]`.
- **Interaction:** `Toggle` component for item availability (PATCH mutation).
- **CRUD:** Edit/Delete buttons open `MenuItemModal` (Controlled Form).

### 4.5 Stock (สต็อก)
- **Sorting:** Severity-based (Empty > Low > Exp Soon > OK).
- **Status Logic:** Unit-tested function `getStockStatus(quantity, reorderPoint, expiryDate)`.
- **Restock:** Small modal for quantity input + confirm button.

### 4.6 Waste Log (ของเสีย) — Advanced Grid
- **Provider:** `WasteFormProvider` with `useReducer` (State: `Record<string, WasteEntry>`).
- **Logic:** Auto-computes `cost = quantity * unitCost`.
- **Footer:** Sum of all row costs formatted via `formatTHB()`.
- **Saving:** Single POST mutation for the entire batch.

### 4.7 Customers (ลูกค้า)
- **Table:** Name, Phone, Loyalty Points (Badge for VIP threshold), Total Spent.
- **Panel:** Right-side slide-in `CustomerDetailPanel` showing transaction history.

### 4.8 Promotions (โปรโมชัน)
- **Cards:** Bold code, discount value, usage count, status badge.
- **Form:** `CreatePromoModal` with unique code validation.

### 4.9 Staff (พนักงาน) & RBAC
- **Protection:** `ProtectedRoute` checks `useAuthStore().role` against `ROLE_PERMISSIONS`.
- **Role Ramps:** Owner (purple), Manager (blue), Staff (gray), Kitchen (amber).
- **Invitations:** POST mutation sends invite link; row shows `Pending` badge.

---

## 5. AI Widget (พุงกางMAN) Specification
- **Persistence:** Mounted in `Layout.tsx`, never re-mounts on navigation.
- **State:** `isMinimized` (collapses to title bar) vs `isOpen` (FAB visible).
- **Context Injection:** `AIContextProvider` wraps each page.
  - *Stock Page:* Injects `{ lowStockItems: [...] }`.
  - *Orders Page:* Injects `{ pendingOrders: [...] }`.
- **UX:** Auto-scrolls on new messages; `useAutoResize` for the textarea.

---

## 6. Recommended Migration Order

1.  **Foundation:** Vite, Tailwind Config (Named tokens), `formatTHB`, `statusStyles`, `Zustand` stores.
2.  **Chrome:** Layout, Sidebar (Active detection via `useLocation`), Header (Click-outside popups).
3.  **Data Layer:** TanStack Query + MSW Handlers.
4.  **Simple Pages:** Customers (CRUD validation) -> Dashboard (Chart & Period State).
5.  **Medium Pages:** Menu (Tabs & Toggles) -> Orders (Optimistic UI) -> Tables (Modals).
6.  **Complex Pages:** Stock (Severity Logic) -> Waste Log (Advanced Reducer Grid).
7.  **System:** Auth/RBAC -> Staff Management.
8.  **Polish:** AI Widget Context -> Error Boundaries -> Skeleton Screens.
