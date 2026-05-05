# React Migration Plan v4: พุงกาง Restaurant Platform
## THIS IS FINAL PLAN

---

## 1. Existing Project Analysis

### 1.1 Project Overview

- **Current Stack:** HTML5, Tailwind CSS via CDN, Vanilla JavaScript
- **Pages:** 9 HTML files — index (Dashboard), table, order, menu, stock, waste, promotion, customer, staff
- **Design Pattern:** Fixed sidebar (210px) + fixed header (54px) + scrollable main content area
- **Architecture:** Multi-page application migrating to a React SPA with client-side routing

### 1.2 Full Color Palette

All tokens must be registered in `tailwind.config.js` under `theme.extend.colors`.

| Token Name | Hex | Usage |
|---|---|---|
| bg-page | #E4E7EC | Root page background |
| bg-sidebar | #E8EBF0 | Sidebar background |
| bg-header | #FFFFFF | Header bar background |
| bg-card | #FFFFFF | Card and panel background |
| bg-subheader | #FCFDFE | Table header row background |
| bg-hover-row | #F9FAFB | Table row hover, popup item hover |
| bg-active-nav | #D6DBE4 | Active sidebar item background |
| text-primary | #1A2333 | Headings, bold labels, main content |
| text-secondary | #6B7A8D | Subtext, inactive nav, table headers |
| text-tertiary | #9AA3AE | Timestamps, hints, disabled states |
| text-dark-neutral | #3D4A5C | AI widget, send button, peak bar |
| border-outer | #C8CDD6 | Cards, sidebar border, header border |
| border-inner | #E8EBF0 | Dividers inside cards and popups |
| border-active | #B4BAC4 | Active period button border |
| success-default | #1D9E75 | Active status dot, revenue up |
| success-bg | #E1F5EE | Ready badge background |
| success-text | #0F6E56 | Ready badge text |
| danger-default | #E24B4A | Revenue down, notifications, waste |
| danger-bg | #FCEBEB | Low stock badge background |
| warning-bg | #FEF3E2 | Cooking, expiring soon background |
| warning-text | #C96A00 | Cooking, expiring soon text |
| warning-border | #FDE5B4 | VIP tier badge border |
| new-badge-bg | #D0D5DE | New order badge background |

### 1.3 Centralized Status Badge System

All badge styles must live exclusively in `src/utils/statusStyles.ts`. No page or component should define its own badge colors. Every badge is a plain object with `bg`, `text`, and optionally `border` properties.

**Order statuses** (used in Orders page, Dashboard preview, and Table modal):
- New → bg #D0D5DE, text #1A2333
- Cooking → bg #FEF3E2, text #C96A00
- Ready → bg #E1F5EE, text #0F6E56
- Paid → bg #D6DBE4, text #1A2333
- Delivered → bg #D6DBE4, text #1A2333
- Cancelled → bg #FCEBEB, text #E24B4A

**Order type badges** (used in Orders page, distinct from status):
- In-Restaurant → bg #E1F5EE, text #0F6E56
- Delivery → bg #E8EBF0, text #3D4A5C
- Take Away → bg #FEF3E2, text #C96A00

**Stock statuses** (computed by `getStockStatus()`):
- Good → no badge rendered
- Exp Soon → bg #FEF3E2, text #C96A00
- Low Stock → bg #FCEBEB, text #E24B4A
- Empty → bg #F9FAFB, border #E8EBF0, text #9AA3AE

**Promotion statuses** (computed by `getPromoStatus()`):
- Active → bg #E1F5EE, text #0F6E56, toggle bg #1D9E75
- Exp Soon → expiry date shown in #C96A00
- Scheduled → toggle bg #C8CDD6, text label #9AA3AE
- Expired → toggle bg #C8CDD6, text label #E24B4A, row opacity 60%

**Table statuses** (color-coded top border and action button):
- Available → top border none, status dot #1D9E75, action button #3D4A5C
- Eating → top border #0F6E56, header bg #E1F5EE/40, action button bg #E1F5EE text #0F6E56
- Cooking → top border #C96A00, header bg #FEF3E2/40, action button bg #FEF3E2 text #C96A00
- Payment → top border #E24B4A, header bg #FCEBEB/40, action button bg #E24B4A text white

**Customer tier badges:**
- VIP Tier → bg #FEF3E2, text #C96A00, border #FDE5B4
- Gold Tier → bg #FCEBEB, text #E24B4A, border #FAD6D6
- Silver Tier → bg #E8EBF0, text #3D4A5C, border #C8CDD6
- Basic Tier → bg #F9FAFB, text #6B7A8D, border #E8EBF0

**Staff role ramps** (avatar background and badge):
- Owner/Manager → avatar bg #D6DBE4, text #1A2333
- Cashier/Server → avatar bg #E1F5EE, text #0F6E56
- Head Chef/Kitchen → avatar bg #FCEBEB, text #E24B4A
- Server (secondary) → avatar bg #FEF3E2, text #C96A00

**Waste reason badges:**
- Expired → bg #FCEBEB, text #E24B4A
- Wrong Order → bg #FEF3E2, text #C96A00
- Accident/Spill → bg #E8EBF0, text #3D4A5C
- Quality Control → bg #E8EBF0, text #3D4A5C

---

## 2. Recommended Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | React 18 + TypeScript | Type safety across all components |
| Build Tool | Vite | Fast HMR, native ESM |
| Routing | React Router DOM v6 | `createBrowserRouter` + nested layouts |
| Server State | TanStack Query v5 | Caching, optimistic updates, retry |
| UI State | Zustand | Sidebar, popups, AI widget |
| Complex Forms | React Context + useReducer | Waste log spreadsheet grid only |
| Styling | Tailwind CSS (local PostCSS) | Named tokens, no CDN |
| Icons | Lucide React | Matches existing stroke-based SVG set |
| Charts | Recharts | Dashboard revenue bar chart |
| API Mocking | MSW (Mock Service Worker) | Dev-time typed mock handlers |
| Testing | Vitest + React Testing Library | Unit + integration tests |

---

## 3. Folder Structure

```
src/
├── api/
│   ├── client.ts           # Axios instance with base URL and interceptors
│   ├── orders.ts
│   ├── tables.ts
│   ├── menu.ts
│   ├── stock.ts
│   ├── waste.ts
│   ├── promotions.ts
│   ├── customers.ts
│   └── staff.ts
├── assets/
│   └── global.css
├── components/
│   ├── layout/
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SidebarNavItem.tsx
│   │   ├── Header.tsx
│   │   └── AIWidget.tsx
│   ├── common/
│   │   ├── Badge.tsx
│   │   ├── Toggle.tsx
│   │   ├── Modal.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── SkeletonRow.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── RecentOrdersList.tsx
│   │   ├── StockAlertCard.tsx
│   │   ├── RecentWasteCard.tsx
│   │   └── PromotionPerformanceCard.tsx
│   ├── tables/
│   │   ├── TableCard.tsx
│   │   └── TableDetailModal.tsx
│   ├── orders/
│   │   ├── OrderRow.tsx
│   │   └── NewOrderModal.tsx
│   ├── menu/
│   │   ├── MenuCard.tsx
│   │   └── MenuItemModal.tsx
│   ├── stock/
│   │   ├── StockRow.tsx
│   │   └── NewLotModal.tsx
│   ├── waste/
│   │   ├── WasteRow.tsx
│   │   └── RecordWasteModal.tsx
│   ├── customers/
│   │   ├── CustomerRow.tsx
│   │   └── CustomerDetailPanel.tsx
│   ├── promotions/
│   │   ├── PromotionRow.tsx
│   │   └── CreatePromoModal.tsx
│   └── staff/
│       ├── StaffRow.tsx
│       └── InviteStaffModal.tsx
├── hooks/
│   ├── useClickOutside.ts
│   ├── useAutoResize.ts
│   ├── useOrders.ts
│   ├── useTables.ts
│   ├── useMenu.ts
│   ├── useStock.ts
│   ├── useWaste.ts
│   ├── usePromotions.ts
│   ├── useCustomers.ts
│   └── useStaff.ts
├── pages/
│   ├── Dashboard.tsx
│   ├── Tables.tsx
│   ├── Orders.tsx
│   ├── Menu.tsx
│   ├── Stock.tsx
│   ├── WasteLog.tsx
│   ├── Promotions.tsx
│   ├── Customers.tsx
│   └── Staff.tsx
├── store/
│   ├── useUIStore.ts
│   ├── useAuthStore.ts
│   ├── useNotificationStore.ts
│   └── useAIWidgetStore.ts
├── providers/
│   ├── AuthProvider.tsx
│   ├── AIContextProvider.tsx
│   └── WasteFormProvider.tsx
├── mocks/
│   ├── browser.ts
│   └── handlers.ts
├── utils/
│   ├── format.ts
│   ├── statusStyles.ts
│   ├── getStockStatus.ts
│   ├── getPromoStatus.ts
│   └── constants.ts
└── __tests__/
    ├── format.test.ts
    ├── getStockStatus.test.ts
    ├── getPromoStatus.test.ts
    ├── statusStyles.test.ts
    └── components/
        ├── Sidebar.test.tsx
        ├── Toggle.test.tsx
        └── WasteForm.test.tsx
```

---

## 4. Shared Architecture — Layout and Chrome

### Sidebar

The Sidebar component is 210px wide, `bg-[#E8EBF0]`, with `border-r border-[#C8CDD6]`. The brand logo area uses `p-[14px_16px]` with a 34×34px icon container containing the three-polygon SVG logo.

The active nav item is detected by comparing each link's `to` prop against `useLocation().pathname`. Active state: `bg-[#D6DBE4] text-[#1A2333] font-medium`. Inactive state: `text-[#6B7A8D] hover:bg-[#D6DBE4] hover:text-[#1A2333]`. All items share `py-[7px] px-[12px] rounded-lg mx-[6px] my-[1px] text-[13px]`.

Section group labels: `pt-[16px] px-[16px] pb-1 text-[10px] text-[#9AA3AE] uppercase tracking-[0.07em] font-semibold`. The four groups are: **Operations** (โต๊ะ, ออเดอร์, เมนู), **Inventory** (สต็อกสินค้า, ของเสีย), **Business** (โปรโมชัน, ลูกค้า), **Credentials** (พนักงาน).

Each nav icon is an 18×18px Lucide stroke icon (stroke-width 2, round caps/joins) matching the exact icon used in the HTML: Dashboard (grid-2x2), โต๊ะ (custom table SVG), ออเดอร์ (file-text), เมนู (list), สต็อกสินค้า (package), ของเสีย (trash-2), โปรโมชัน (plus-circle), ลูกค้า (user), พนักงาน (users).

The ออเดอร์ link renders a live badge: `bg-[#E24B4A] text-white text-[10px] py-[1px] px-[6px] rounded-full ml-auto`. The `SidebarNavItem` for ออเดอร์ accepts an `orderCount` prop derived from `useOrders()` filtering for statuses New and Cooking.

On mobile (below `lg`): sidebar is `absolute inset-y-0 left-0 z-[100]` starting with `-translate-x-full`. When `useUIStore.sidebarOpen` is true, switches to `translate-x-0`. A `z-[90] bg-[#1A2333]/40` overlay dismisses on click. Transition: `duration-300 ease-in-out`.

The Log out button at the bottom opens a modal explaining the user cannot log out in the testing environment.

### Header

`h-[54px] bg-white border-b border-[#C8CDD6] flex items-center px-4 sm:px-5 gap-2.5 z-[60]`.

The hamburger button is `lg:hidden p-1.5 -ml-2 rounded-lg text-[#6B7A8D]` and calls `useUIStore.toggleSidebar()`.

The profile section opens `popup-profile`: a 256px wide popup anchored `top-[100%] left-0`. The header section has a 40px avatar (bg #D6DBE4, 14px font initials), full name (14px font-semibold), and email (11px #6B7A8D) on `#F9FAFB` background. Below: two rows showing Role and Workspace separated by `border-[#E8EBF0]`.

The bell icon renders a `w-2 h-2 bg-[#E24B4A]` dot conditionally based on `useNotificationStore.unreadCount > 0`. The notification popup is 288px wide (`w-72`), `max-h-64 overflow-y-auto`, with a `#F9FAFB` header. Each notification item shows title (12px font-medium), timestamp (10px — #E24B4A urgent, #1D9E75 new, #9AA3AE older), and subtitle (11px #6B7A8D).

The settings popup is 224px wide with Toggle for Active Online Status (starts on, track #1D9E75) and a language `<select>`. The Toggle component is fully controlled: `checked: boolean`, `onChange: (val: boolean) => void`. Track: `w-7 h-4 rounded-full`. Dot: `w-3 h-3 bg-white rounded-full absolute`. Checked: dot at `right-0.5 top-0.5`. Unchecked: `left-0.5 top-0.5`.

All three popups share mutual-exclusion via `useUIStore.openPopup(name)`. A `useClickOutside` hook calls `useUIStore.closeAllPopups()` on outside click.

### Page Header Bar

Every page has a sub-header: `pt-4 px-5 pb-[14px] bg-white border-b border-[#C8CDD6]`. Contains: left column (20px font-medium title, 12px #6B7A8D subtitle), center stat counters (`hidden md:flex`), right action buttons.

Stat counters: `text-[10px] uppercase tracking-wider` labels with `text-[18px] font-medium` values, separated by `border-l border-[#E8EBF0] pl-6`.

Primary action buttons: `text-[12px] py-[6px] px-[14px] rounded-lg bg-[#3D4A5C] text-white font-medium hover:bg-[#2C3643] flex items-center gap-1.5 shadow-sm`.

Secondary buttons: `border border-[#C8CDD6] bg-transparent text-[#6B7A8D] hover:bg-[#F9FAFB]`.

---

## 5. Utility Functions

### formatTHB (`src/utils/format.ts`)

```typescript
export function formatTHB(value: number): string
// 15240     → "฿15,240.00"
// 0         → "฿0.00"
// -75       → "-฿75.00"  ← minus BEFORE the ฿ symbol

export function formatDate(date: Date | string): string
// Returns "Today", "Yesterday", or "22 Apr 2026"

export function formatElapsed(startTime: Date | string): string
// < 1 min   → "Just now"
// < 60 min  → "12 min"
// >= 60 min → "1 hr 15 min"
```

### getStockStatus (`src/utils/getStockStatus.ts`)

```typescript
export function getStockStatus(
  quantity: number,
  reorderPoint: number,
  expiryDate: string | null
): 'Good' | 'Low Stock' | 'Exp Soon' | 'Empty'
```

Evaluation order: quantity ≤ 0 → Empty; expiryDate within 3 days → Exp Soon; quantity ≤ reorderPoint → Low Stock; otherwise → Good. Null `expiryDate` skips expiry check.

### getPromoStatus (`src/utils/getPromoStatus.ts`)

```typescript
export function getPromoStatus(
  startDate: string,
  endDate: string
): 'Active' | 'ExpSoon' | 'Scheduled' | 'Expired'
```

Rules: today past endDate → Expired; today before startDate → Scheduled; endDate within 7 days → ExpSoon; otherwise → Active.

### ROLE_PERMISSIONS (`src/utils/constants.ts`)

```typescript
export const TAX_RATE = 0.07;
export const SERVICE_CHARGE = 0.10;
export const VIP_POINT_THRESHOLD = 1000;

export const ROLE_PERMISSIONS: Record<Role, { pages: string[]; actions: string[] }> = {
  owner:   { pages: ['*'], actions: ['*'] },
  manager: { pages: ['dashboard','tables','orders','menu','stock','waste','promotions','customers'], actions: ['*'] },
  cashier: { pages: ['dashboard','tables','orders'], actions: ['view','create_order','accept_order'] },
  server:  { pages: ['dashboard','tables','orders'], actions: ['view','create_order'] },
  kitchen: { pages: ['dashboard','orders','stock'], actions: ['view','update_order_status'] },
};
```

---

## 6. Page-Specific Specifications

### Dashboard

Period state: `'today' | 'week' | 'month'` default `'week'`. Period selector buttons below title — active: `bg-[#D6DBE4] border border-[#B4BAC4] text-[#1A2333] font-medium` with downward chevron SVG (fill #6B7A8D, 11×11px). Inactive: `border border-[#C8CDD6] bg-transparent text-[#6B7A8D]`. Labels: วันนี้, สัปดาห์นี้, เดือนนี้.

Four stat cards in `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5`. Each card: `bg-white border border-[#C8CDD6] rounded-xl py-[14px] px-[15px]`. Header row: 11px label left, 7px solid dot right (revenue #1D9E75, orders #3D4A5C, AOV #E24B4A, tables #C96A00). Value: 21px font-medium. Change: 11px (#1D9E75 positive, #E24B4A negative). Orders card and Tables card are `<Link>` with `hover:shadow-md hover:border-[#9AA3AE] transition-all`.

**StatCard props:** `label: string, value: string, change: string, changeColor: string, dotColor: string, href?: string`

Revenue Chart: Recharts `BarChart` 110px tall. Peak bar fill: `#3D4A5C`. Others: `#D0D5DE`. Value labels above: 9px, #3D4A5C bold for peak, #9AA3AE others. Day labels below: 10px, #1A2333 bold for peak, #9AA3AE others.

Recent Orders list is a `<Link to="/orders">` card. Each row: `flex items-center gap-2 py-[7px] border-b border-[#C8CDD6]`. Columns: order ID (`text-[12px] font-medium text-[#1A2333] min-w-[40px]`), item summary (`flex-1 text-[12px] text-[#6B7A8D] whitespace-nowrap overflow-hidden text-ellipsis`), status badge (`text-[10px] py-[2px] px-2 rounded-full font-medium min-w-[58px] text-center`), elapsed (`text-[11px] text-[#9AA3AE] min-w-[38px] text-right`).

Three bottom cards (Stock Alerts, Recent Waste, Promotion Performance): each `<Link>` with own `useQuery`, `hover:shadow-md hover:border-[#9AA3AE] transition-all`.

### Tables (โต๊ะ)

Sub-header counters: Total (15), Available (7 in #1D9E75), Occupied (8 in #C96A00), Warning (2 in #E24B4A — tables over time threshold).

Filter pills: `overflow-x-auto no-scrollbar`. Active: `bg-[#3D4A5C] text-white`. Inactive: `bg-white border border-[#C8CDD6] text-[#6B7A8D] text-[11px] px-3 py-1.5 rounded-full`. Options: All Tables, Available, Occupied, Window View, VIP Zone.

Grid/list toggle: `hidden md:flex`. Active view: `bg-white shadow-sm text-[#3D4A5C]`. Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4`.

**TableCard:** `bg-white border border-[#C8CDD6] rounded-xl flex flex-col shadow-sm overflow-hidden` with `transition: all 0.2s ease-in-out` and `hover:translateY(-2px)`.

Occupied cards: 4px top border by status (Eating #0F6E56, Cooking #C96A00, Payment #E24B4A). Tinted header bg (Eating #E1F5EE/40, Cooking #FEF3E2/40, Payment #FCEBEB/40). Order details section: `bg-white border border-[#E8EBF0] rounded-lg p-1.5 sm:p-2.5` with order ID + mini status badge, 2 line items, total row with top border.

Available cards: no top border, neutral header, centered empty-state with SVG table icon (circle + 4 chair rectangles), "Available" label in `#9AA3AE font-bold uppercase`.

Primary action button (full width): Available → `bg-[#3D4A5C] text-white` "Seat Guest", Eating → `bg-[#E1F5EE] text-[#0F6E56]` "Eating", Cooking → `bg-[#FEF3E2] text-[#C96A00]` "Cooking", Payment → `bg-[#E24B4A] text-white` "Payment".

**TableDetailModal:** `fixed` overlay `backdrop-blur-md bg-[#1A2333]/60 z-[200]`. Modal `max-w-4xl max-h-[85vh]`. Left panel (1/3 on lg+): status badge, elapsed time, primary action, Transfer Table button. Right panel: full order, subtotal, service charge (10%), total. Available tables: right panel `opacity-40 pointer-events-none`.

List view columns: Table, Status badge, Seats/Area, Order ID, Time, Total, Actions.

### Orders (ออเดอร์)

Two tabs: Active Orders and Historical Orders. Underline-style — active tab: `color: #1A2333`, `2px border-b #1A2333`. Active Orders tab has live count badge `bg-[#E24B4A] text-white text-[10px] py-[1px] px-[6px] rounded-full` inline after label.

Sub-header counters: Today's Orders, Revenue, Active count, Avg. Prep time.

**NewOrderModal:** `absolute inset-0 z-[80]`. Header: back arrow + "Create New Manual Order" + Discard button. Body split: left scrollable form (`flex-1`), right summary panel (`w-[320px] bg-[#F9FAFB]`). Confirm button: `bg-[#1D9E75] text-white hover:bg-[#168562]`.

Order Details section: 2-column grid — Order Type (select: In-Restaurant, Take Away, Delivery) + Table Number/Staff (text input). Menu Selection: search input + grid of mini cards (`p-3 border border-[#E8EBF0] rounded-xl hover:border-[#3D4A5C]`).

**Active Orders table columns:** Order ID, Date & Time, Type badge, Table/Staff (table number + staff initials in 10px #9AA3AE), Subtotal (right-aligned #6B7A8D), Disc/Tax (discount #E24B4A, tax #6B7A8D), Total Price (right-aligned font-medium), Status badge. All 12px.

**Historical Orders:** adds Payment Time column, date filter input, Export PDF button.

New orders: Accept button triggers optimistic update via `useMutation` — immediately sets status to Cooking in UI cache, rolls back via `onError` if API fails.

### Menu (เมนู)

Sub-header counters: Total Items (48), Active (42), Out of Stock (3), Top Seller (Family Set 1).

Category tabs derived dynamically: `[...new Set(menuItems.map(i => i.category))]`. Known categories: Main, Drink, Dessert, Add-on. Active pill: `bg-[#D6DBE4] border border-[#B4BAC4] text-[#1A2333]`. Inactive: `border-transparent text-[#6B7A8D]`.

**MenuItemModal:** `absolute inset-0 z-[80]`. Sticky top header with back arrow and "Add New Menu Item". Form centered `max-w-3xl mx-auto` with two cards:
- Item Image card: `border-2 border-dashed border-[#C8CDD6] rounded-xl h-40` drag-drop zone with upload icon.
- Item Details card: 2-column grid. Item Name spans full width (`md:col-span-2`). Menu Type (native select). Price (฿) (number input). Description (optional 3-row textarea, full width).

Menu grid: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4`.

**MenuCard:** `bg-white border border-[#C8CDD6] rounded-xl overflow-hidden flex flex-col shadow-sm group`. Image area: `h-[130px] bg-[#E8EBF0]` with centered placeholder icon. Category badge: `absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-medium`.

Card body: name (13px font-medium) + price (13px font-semibold) on one row. Bottom row: availability Toggle left, Edit/Delete icon buttons right (`opacity-0 group-hover:opacity-100 transition-opacity`). Edit hover: #3D4A5C. Delete hover: #E24B4A.

Toggle availability fires `PATCH` mutation. Active: track bg #1D9E75, label "Active" in #1D9E75. Inactive: track bg #C8CDD6, label "Inactive" in #9AA3AE.

### Stock (สต็อก)

Each row represents a lot (batch), not just an ingredient. Table columns: Lot/Stock ID (e.g. #LOT-82B001), Ingredient ID (e.g. ING-001), Ingredient Name, Quantity (right-aligned), Unit, Price (right-aligned), Expiry Date, Active Status toggle, Lot Status badge, Action (Edit link).

Sub-header counters: Total Value (฿32,450), Active Items (42), Low Stock (3 in #E24B4A), Expiring Soon (2 in #C96A00).

**NewLotModal:** `absolute inset-0 z-[80]`. Sticky header: "Record New Stock / Lot (Batch Upload)", Cancel link, "Import Data" button in `bg-[#1D9E75]`.

Spreadsheet columns: Ingredient ID, Ingredient Name, Quantity, Unit, Total Price (฿), Expiry Date (YYYY-MM-DD). 20 rows by default. "+ Add 10 Rows" button appends 10 more rows. Row numbers in leftmost column on `#E5E7EB` background.

Focused cells: `background-color: #EBF5FF; outline: 2px solid #2563EB; outline-offset: -2px`.

Each cell is a controlled `<input>` (not `contenteditable`). Sort by: Name alphabetically, Quantity ascending, Status severity (Empty → Low Stock → Exp Soon → Good) — via `useMemo`.

### Waste Log (ของเสีย)

Sub-header counters: Total Lost (฿1,425 in #E24B4A), Expired (12), Mistakes (4), Accidents (2).

**"Record Waste" button:** `bg-[#E24B4A] text-white hover:bg-[#C94241]` — distinct red from all other pages.

Main table columns: Waste ID (e.g. WST-04001, monospace), Date & Time, Item/Ingredient, Category/Reason badge, Quantity, Est. Value Lost (right-aligned #E24B4A font-medium with minus sign), Recorded By, Action (Details link).

**RecordWasteModal:** `absolute inset-0 z-[80]`. Sticky header: "Record Waste (Batch Upload)", Cancel, "Save Records" in `bg-[#E24B4A]`. Spreadsheet columns: Date (YYYY-MM-DD), Item/Ingredient, Reason (select: Expired / Wrong Order / Accident-Spill / Quality Control), Quantity, Est. Value Lost (฿), Recorded By.

**WasteFormProvider** wraps only the WasteLog route. State via `useReducer`:

```typescript
type WasteFormState = Record<string, WasteEntry>
type WasteEntry = {
  id: string; date: string; itemName: string;
  reason: WasteReason; quantity: string; unit: string;
  cost: number; // read-only, auto-computed: parseFloat(quantity) * unitCost
}
// Actions:
// ADD_ROW    → appends blank entry with generated UUID
// DELETE_ROW → removes entry by id
// UPDATE_CELL → { rowId, field, value } updates single cell
```

Cost is read-only, auto-computed as `quantity × unitCost` (unitCost looked up from stock data). Monthly total footer: `Object.values(entries).reduce((sum, e) => sum + e.cost, 0)` formatted with `formatTHB()`.

Save button: single `POST` mutation batching all entries. While saving: loading spinner, button disabled.

### Customers (ลูกค้า)

Sub-header counters: Total Members (1,245), VIP Members (85), Member Revenue (฿345K), Points Issued (42,500). Action buttons: Export Data (secondary) + Add Member (primary).

Table header: Tier filter dropdown + search input (`bg-[#FCFDFE]`).

**Table columns:** Customer Profile (32px avatar circle by tier + name 13px font-medium + email 11px #6B7A8D), Contact Details (phone with phone icon #6B7A8D + Line ID with chat icon #1D9E75, "Not linked" in #9AA3AE italic if missing), Tier & Points (tier badge + points 11px font-medium #1A2333), Lifetime Stats (total spent `formatTHB()` font-medium + order count 10px #6B7A8D right-aligned), Last Visit (date #1A2333 + channel 10px #9AA3AE), Actions.

Avatar bg by tier: VIP #FEF3E2/#C96A00, Gold #E1F5EE/#0F6E56, Silver #D0D5DE/#1A2333, Basic #F9FAFB border #C8CDD6/#6B7A8D.

Action buttons per row: View Profile (eye icon, hover #3D4A5C), Adjust Points (plus icon, hover #1D9E75), Edit (pencil icon, hover #3D4A5C). All 15px stroked.

**CustomerDetailPanel:** right-side slide-in panel showing full profile, tier history, and past orders as dated transaction rows.

### Promotions (โปรโมชัน)

Sub-header counters: Active Promos (3), Total Usage (342), Total Discount (฿4,250), Expiring Soon (1 in #C96A00).

**Table columns:** Promo Code/Name (bold code + description 10px #9AA3AE), Discount Type (font-medium #3D4A5C — "10% Off Total Bill", "Free Item (Fries)", "฿50 Off Fixed Amount"), Validity Period (From date + To date, To date turns #C96A00 font-medium if expiring soon), Usage Count (right-aligned), Total Amount Spent (right-aligned #E24B4A font-medium), Status (Toggle + label), Actions.

Status toggle: Active → track #1D9E75, label "Active" in #1D9E75. Scheduled/Expired → track #C8CDD6. Labels: "Scheduled" #9AA3AE, "Expired" #E24B4A.

Expired rows: `opacity-60`. Edit button: `text-[#C8CDD6] cursor-not-allowed`. Delete button: remains `hover:text-[#E24B4A]`.

**CreatePromoModal:** centered standard modal (not full-page). Fields: Promo Code (text, auto-uppercased on input), Promotion Name/Description (text), Discount Type (select: Percentage Off / Fixed Amount Off / Free Item), Discount Value (number), Start Date, End Date, Usage Limit (number, optional). Validates code uniqueness before enabling save.

### Staff (พนักงาน)

Sub-header counters: Total Staff (12), Active Today (8), Managers (2), Locked (1 in #E24B4A).

**ProtectedRoute:** `requiredRoles={['owner', 'manager']}` — others redirect to Dashboard.

Table header: Role filter dropdown + name/email search input.

**Table columns:** Staff Member (32px avatar by role + name + email), Role & Manager (role name font-medium + manager name 10px #9AA3AE), Area & Access (area name + access badge chips), Last Login, Status (Toggle + label), Actions.

Access badge chips (9px): "Full Access" bg #E8EBF0/#3D4A5C, "POS Module" bg #FEF3E2/#C96A00, "Orders" bg #F9FAFB border #E8EBF0/#6B7A8D, "Table App" same neutral, "KDS Screen" bg #D0D5DE/#1A2333, "Stock" bg #E1F5EE/#0F6E56.

Locked row: `opacity-75`. Locked toggle: track #E24B4A. Manage Access for locked row: `text-[#E24B4A] hover:text-[#1D9E75]`. For active users: `text-[#6B7A8D] hover:text-[#E24B4A]`.

Owner row: Manage Access button `text-[#C8CDD6] cursor-not-allowed`. Owner row cannot be edited, locked, or removed.

Action buttons per row: Notes/Log (document icon), Manage Access (calendar-person icon), Account Settings (person icon, hover #C96A00), Edit (pencil icon). All 15px stroked.

**InviteStaffModal:** centered modal. Fields: Email address + Role select. On submit: `POST` mutation. Invited row appears with "Pending" badge and greyed-out action buttons until accepted.

---

## 7. AI Widget (พุงกางMAN) — Full Specification

Mounted once inside `Layout.tsx`, never re-mounts on navigation. Position: `fixed bottom-6 right-6 z-[1000]`.

**useAIWidgetStore (Zustand):** `isOpen: boolean, isMinimized: boolean, unreadCount: number, messages: Message[], pageContext: AIContext | null`.

**FAB button:** `w-16 h-16 bg-[#3D4A5C] text-white rounded-full shadow-2xl hover:scale-110 transition-transform`. Red badge `absolute -top-1 -right-1 w-5 h-5 bg-[#E24B4A] border-2 border-white rounded-full` when `unreadCount > 0`. Click: `isOpen = true`, `unreadCount = 0`.

**Chat window:** `bg-white rounded-2xl shadow-2xl border border-[#C8CDD6] overflow-hidden w-[500px] h-[750px] max-h-[85vh] max-w-[calc(100vw-32px)]`.

**Window header:** `bg-[#3D4A5C] p-5`. Bot avatar: 40px white circle with concentric ring icon in `text-[#3D4A5C]`. Name "พุงกางMAN" bold lg. Subtitle "AI Assistant • Online" 11px 80% opacity. Buttons: minimize (dash icon) and close (X icon), both `p-2 hover:bg-white/10 rounded-lg`. Clicking header minimizes. Minimize: `isMinimized = true` (collapses to title bar only). Close: `isOpen = false` (shows FAB again).

**Message area:** `flex-1 overflow-y-auto p-6 bg-[#F9FAFB] flex flex-col gap-4`.

Message shape: `{ id: string, role: 'user' | 'ai', text: string, timestamp: Date }`.

User messages: `self-end max-w-[85%] bg-[#3D4A5C] text-white p-4 rounded-2xl rounded-tr-none shadow-md text-[14px]`.

AI messages: `max-w-[85%] bg-white border border-[#E8EBF0] p-4 rounded-2xl rounded-tl-none shadow-sm text-[14px] text-[#1A2333]`.

Both have timestamp below: `text-[10px] text-[#9AA3AE]`.

Auto-scroll: `useEffect` on every `messages` change → `messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })`.

**Input area:** `bg-[#F4F6F9] rounded-2xl p-2 border border-transparent focus-within:border-[#C8CDD6] transition-all`. Textarea with `useAutoResize` hook. Send button: `bg-[#3D4A5C] p-3 rounded-xl hover:bg-[#2A3544]`. Enter sends. Shift+Enter inserts newline. Footer: `"Powered by Pungkang AI"` in `text-[10px] text-[#9AA3AE] text-center uppercase tracking-widest font-medium`.

**Context injection per page:**

| Page | Context Data |
|---|---|
| Dashboard | `{ currentPeriod, revenueData }` |
| Tables | `{ tableStatuses, occupiedCount }` |
| Orders | `{ pendingOrders, activeOrderCount }` |
| Menu | `{ outOfStockItems, topSeller }` |
| Stock | `{ lowStockItems, expiringSoonItems }` |
| Waste | `{ monthlyTotal, recentEntries }` |
| Customers | `{ vipCount, totalPoints }` |
| Promotions | `{ activePromos, expiringSoon }` |
| Staff | `{ activeToday, lockedCount }` |

---

## 8. Advanced Production Features

### Data Layer

All API functions in `src/api/` use a typed axios instance from `src/api/client.ts`. Signatures: `getOrders(): Promise<Order[]>`, `updateOrderStatus(id, status): Promise<Order>`, `patchMenuItemAvailability(id, available): Promise<MenuItem>`, etc.

Custom hooks in `src/hooks/` wrap `useQuery` and `useMutation`. Each exposes `{ data, isLoading, isError, refetch }` for queries and `{ mutate, isPending }` for mutations. During development, MSW intercepts all calls and returns typed mock data.

### Auth and Route Guarding

`AuthProvider` populates `useAuthStore` on mount from stored JWT. `ProtectedRoute` accepts `requiredRoles: Role[]` and redirects unauthorized users with `<Navigate to="/" replace />`. `usePermission(action: string): boolean` reads from `ROLE_PERMISSIONS` for conditional rendering of buttons, columns, and inputs.

### Error Boundaries and Loading States

Every page wrapped in `react-error-boundary`. Failed queries render a friendly card with a retry button. Loading states use skeleton screens: `SkeletonRow` for tables, skeleton `StatCard` for dashboard, skeleton bars for revenue chart — all driven by TanStack Query's `isLoading` boolean.

### Testing Coverage

**Unit tests:** `formatTHB()` (zero, large, negative, decimal), `getStockStatus()` (all four status boundaries + null expiry), `getPromoStatus()` (all four status boundaries), `ROLE_PERMISSIONS` (every role-action combination).

**Component tests:** Sidebar renders correct active item given mocked `useLocation`; Toggle updates track color and dot position on click; Dashboard period selector switches chart data; Waste Log ADD_ROW and DELETE_ROW dispatch; `getStockStatus()` integration in StockRow.

---

## 9. Recommended Migration Order

Each phase must be fully complete and tested before the next begins. "Complete" means: all unit tests pass, dev server renders without console errors, MSW mock data flows correctly end-to-end.

---

### Phase 1 — Foundation & Tooling

#### Step 1.1 — Vite + TypeScript + React 18

Initialize: `npm create vite@latest pungkang -- --template react-ts`

Install all dependencies in one pass:
```bash
npm install react-router-dom @tanstack/react-query zustand lucide-react recharts axios msw react-error-boundary
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom @types/react @types/react-dom
```

Verify dev server runs clean before touching any configuration.

#### Step 1.2 — Tailwind CSS Local Configuration

Remove any CDN reference. Install: `npm install -D tailwindcss postcss autoprefixer`. Run: `npx tailwindcss init -p`.

In `tailwind.config.js`, extend `theme.colors` with every named token from section 1.2:
```js
colors: {
  brand: {
    page: '#E4E7EC',
    sidebar: '#E8EBF0',
    card: '#FFFFFF',
    'subheader': '#FCFDFE',
    'hover-row': '#F9FAFB',
    'active-nav': '#D6DBE4',
    'text-primary': '#1A2333',
    'text-secondary': '#6B7A8D',
    'text-tertiary': '#9AA3AE',
    'text-dark': '#3D4A5C',
    'border-outer': '#C8CDD6',
    'border-inner': '#E8EBF0',
    'border-active': '#B4BAC4',
    'success': '#1D9E75',
    'success-bg': '#E1F5EE',
    'success-text': '#0F6E56',
    'danger': '#E24B4A',
    'danger-bg': '#FCEBEB',
    'warning-bg': '#FEF3E2',
    'warning-text': '#C96A00',
    'warning-border': '#FDE5B4',
    'new-badge': '#D0D5DE',
  }
}
```

In `src/assets/global.css`, add the three Tailwind directives and import it in `main.tsx`. Verify a test element using `bg-brand-page` renders correctly.

#### Step 1.3 — TypeScript Interfaces (`src/types/index.ts`)

Define all interfaces before writing any hook or component. No `any` allowed.

```typescript
// Core types
type OrderStatus = 'New' | 'Cooking' | 'Ready' | 'Paid' | 'Delivered' | 'Cancelled'
type OrderType = 'In-Restaurant' | 'Take Away' | 'Delivery'
type TableStatus = 'Available' | 'Eating' | 'Cooking' | 'Payment'
type StockStatus = 'Good' | 'Low Stock' | 'Exp Soon' | 'Empty'
type PromoStatus = 'Active' | 'ExpSoon' | 'Scheduled' | 'Expired'
type CustomerTier = 'VIP' | 'Gold' | 'Silver' | 'Basic'
type StaffRole = 'owner' | 'manager' | 'cashier' | 'server' | 'kitchen'
type WasteReason = 'Expired' | 'Wrong Order' | 'Accident/Spill' | 'Quality Control'

// Entity interfaces
interface Order { id: string; type: OrderType; tableId?: string; staffId: string;
  items: OrderItem[]; subtotal: number; discount: number; tax: number; total: number;
  status: OrderStatus; createdAt: string; updatedAt: string; }

interface OrderItem { menuItemId: string; name: string; quantity: number; price: number; }

interface Table { id: string; number: number; seats: number; area: string;
  status: TableStatus; currentOrderId?: string; seatedAt?: string; }

interface MenuItem { id: string; name: string; category: string; price: number;
  imageUrl?: string; available: boolean; description?: string; }

interface StockLot { id: string; ingredientId: string; ingredientName: string;
  quantity: number; unit: string; price: number; expiryDate: string | null;
  reorderPoint: number; active: boolean; }

interface WasteEntry { id: string; date: string; itemName: string; reason: WasteReason;
  quantity: number; unit: string; estimatedCost: number; recordedBy: string; }

interface Promotion { id: string; code: string; name: string; discountType: 'percentage' | 'fixed' | 'free_item';
  discountValue: number; startDate: string; endDate: string; usageCount: number;
  usageLimit?: number; totalAmountSaved: number; active: boolean; }

interface Customer { id: string; name: string; email: string; phone: string;
  lineId?: string; tier: CustomerTier; points: number; totalSpent: number;
  orderCount: number; lastVisit: string; lastChannel: string; }

interface Staff { id: string; name: string; email: string; role: StaffRole;
  managerId?: string; area: string; lastLogin: string; isLocked: boolean; isPending?: boolean; }

interface Notification { id: string; title: string; subtitle: string;
  timestamp: string; urgency: 'urgent' | 'new' | 'normal'; read: boolean; }

interface Message { id: string; role: 'user' | 'ai'; text: string; timestamp: Date; }

interface AIContext { page: string; contextData: Record<string, unknown>; }
```

#### Step 1.4 — React Router Setup

In `main.tsx`, use `createBrowserRouter` with nested routes under a single Layout:

```typescript
const router = createBrowserRouter([{
  path: '/',
  element: <AuthProvider><Layout /></AuthProvider>,
  children: [
    { index: true, element: <Dashboard /> },
    { path: 'tables', element: <Tables /> },
    { path: 'orders', element: <Orders /> },
    { path: 'menu', element: <Menu /> },
    { path: 'stock', element: <Stock /> },
    { path: 'waste', element: <WasteFormProvider><WasteLog /></WasteFormProvider> },
    { path: 'promotions', element: <Promotions /> },
    { path: 'customers', element: <Customers /> },
    { path: 'staff', element: <ProtectedRoute requiredRoles={['owner','manager']}><Staff /></ProtectedRoute> },
  ],
}, { path: '*', element: <Navigate to="/" replace /> }]);
```

Wrap `RouterProvider` in `QueryClientProvider` and verify `/tables` renders without errors.

---

### Phase 2 — Utility Layer (Write Tests First)

#### Step 2.1 — `src/utils/format.ts`

Implement `formatTHB`, `formatDate`, `formatElapsed`. Write `src/__tests__/format.test.ts` first — tests must pass before moving on.

Test cases for `formatTHB`: `0 → "฿0.00"`, `15240 → "฿15,240.00"`, `-75 → "-฿75.00"` (minus before ฿), `0.999 → "฿1.00"` (rounding).

Test cases for `formatElapsed`: 30 seconds ago → "Just now", 12 minutes ago → "12 min", 75 minutes ago → "1 hr 15 min".

#### Step 2.2 — `src/utils/getStockStatus.ts`

Test cases: `quantity=0` → Empty, `quantity=-1` → Empty, expiry exactly 3 days away → Exp Soon, expiry 4 days away → Good, `quantity === reorderPoint` → Low Stock, `quantity === reorderPoint + 1` → Good, `expiryDate=null` at low quantity → Low Stock (not Exp Soon).

#### Step 2.3 — `src/utils/statusStyles.ts`

Define the `STATUS_STYLES` constant and all helper getter functions listed in section 1.3. Write `statusStyles.test.ts` verifying each getter returns the correct `bg` and `text` for every valid input including edge cases (Cancelled order, Empty stock, Expired promo, Locked staff).

#### Step 2.4 — `src/utils/getPromoStatus.ts`

Test cases: expiry exactly today → Expired, expiry yesterday → Expired, start date tomorrow → Scheduled, start date today → Active, endDate exactly 7 days from now → ExpSoon, endDate 8 days from now → Active.

#### Step 2.5 — `src/utils/constants.ts`

Define `TAX_RATE`, `SERVICE_CHARGE`, `VIP_POINT_THRESHOLD`, and the full `ROLE_PERMISSIONS` object. Write tests verifying: owner has access to all pages, kitchen cannot access 'staff' page, cashier cannot perform 'delete_menu_item' action.

---

### Phase 3 — Zustand Stores

#### Step 3.1 — `useUIStore.ts`

```typescript
interface UIState {
  sidebarOpen: boolean;
  activePopup: 'profile' | 'notifications' | 'settings' | null;
  tableView: 'grid' | 'list';  // for Tables page
  toggleSidebar: () => void;
  setSidebarOpen: (val: boolean) => void;
  openPopup: (name: UIState['activePopup']) => void;
  closeAllPopups: () => void;
  setTableView: (view: UIState['tableView']) => void;
}
```

#### Step 3.2 — `useAuthStore.ts`

```typescript
interface AuthState {
  user: Staff | null;
  role: StaffRole;
  workspace: string;
  isAuthenticated: boolean;
  login: (user: Staff) => void;
  logout: () => void;
}
```

#### Step 3.3 — `useNotificationStore.ts`

```typescript
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Notification) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
}
```

#### Step 3.4 — `useAIWidgetStore.ts`

```typescript
interface AIWidgetState {
  isOpen: boolean;
  isMinimized: boolean;
  unreadCount: number;
  messages: Message[];
  pageContext: AIContext | null;
  open: () => void;
  close: () => void;
  minimize: () => void;
  sendMessage: (text: string) => void;
  setPageContext: (ctx: AIContext) => void;
  incrementUnread: () => void;
}
```

---

### Phase 4 — MSW Mock Handlers

Create `src/mocks/handlers.ts` with typed handlers for every API endpoint. All mock data must match the TypeScript interfaces from Step 1.3 exactly.

Required handlers:
- `GET /api/orders` → array of 10+ orders with varied statuses
- `GET /api/tables` → 15 tables with varied statuses including Eating, Cooking, Payment
- `GET /api/menu` → 48 menu items across 4 categories
- `GET /api/stock` → 20+ lots with varied statuses including Empty and Exp Soon
- `GET /api/waste` → 18 waste entries with varied reasons
- `GET /api/promotions` → 5 promos with Active, ExpSoon, and Expired statuses
- `GET /api/customers` → 20 customers with varied tiers
- `GET /api/staff` → 12 staff with varied roles including a Locked member
- `GET /api/dashboard/summary` → period-indexed data object with `today`, `week`, `month` keys
- `PATCH /api/orders/:id` → returns updated order
- `PATCH /api/menu/:id` → returns updated menu item
- `PATCH /api/stock/:id` → returns updated lot
- `POST /api/orders` → returns new order with generated ID
- `POST /api/waste` → returns array of created waste entries
- `POST /api/stock/lots` → returns array of created lots
- `POST /api/staff/invite` → returns pending staff member
- `DELETE /api/promotions/:id` → returns `{ success: true }`

Initialize MSW in `src/mocks/browser.ts` and start the service worker in `main.tsx` in development mode only.

---

### Phase 5 — TanStack Query Setup + Typed API Functions

Configure `QueryClient` in `main.tsx`:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 2 },
    mutations: { retry: 0 },
  },
});
```

Create `src/api/client.ts` with an axios instance pointing to `/api`. Write all typed API functions. Create all custom hooks in `src/hooks/` wrapping these functions. Verify that calling `useOrders()` in a test component returns the MSW mock data.

---

### Phase 6 — Layout, Sidebar, Header

Build `Layout.tsx`: renders Sidebar + Header as persistent chrome with `<Outlet />` in the scrollable main area. Sidebar has `overflow-y-auto pb-4` scroll on the nav list.

Build `Sidebar.tsx` with `SidebarNavItem.tsx`. The ออเดอร์ item subscribes to `useOrders()` and passes the live count as `orderCount` prop. Write `Sidebar.test.tsx` verifying correct active item given mocked `useLocation`.

Build `Header.tsx`. Implement `useClickOutside` hook and attach to each popup ref. Write `Toggle.test.tsx` verifying track color and dot position on controlled state change.

Build `AIWidget.tsx` following section 7 specification. Wire up `useAutoResize` on the textarea.

**Completion check:** Navigating between all 9 routes renders the correct active nav item. The ออเดอร์ badge updates when mock data changes. All three header popups open, dismiss on outside click, and mutually exclude each other. AI widget opens, minimizes, and closes correctly. Mobile sidebar overlays and dismisses.

---

### Phase 7 — Dashboard Page

Build `Dashboard.tsx` with period state, period selector, four `StatCard` components, `RevenueChart`, `RecentOrdersList`, and three bottom summary cards.

Build `StatCard.tsx` with `href?` prop — render as `<Link>` when provided, plain div otherwise. Implement `hover:shadow-md hover:border-[#9AA3AE]` on Orders and Tables cards only.

Build `RevenueChart.tsx`. Compute peak bar in `useMemo`: `bars.map(b => ({ ...b, fill: b.value === maxValue ? '#3D4A5C' : '#D0D5DE' }))`. Render `LabelList` for value labels above and day labels below.

Build `StockAlertCard.tsx`, `RecentWasteCard.tsx`, `PromotionPerformanceCard.tsx` — each with its own `useQuery` for summary data.

**Completion check:** Clicking วันนี้/สัปดาห์นี้/เดือนนี้ switches all four stat values and the chart. Peak bar is dark. Orders and Tables cards are clickable links. Bottom cards link to their respective pages.

---

### Phase 8 — Customers Page

Build `Customers.tsx` with search state and tier filter. `useCustomers()` fetches all customers. Filtered list via `useMemo` applying both filters.

Build `CustomerRow.tsx` with all six column cells. Avatar background determined by `getCustomerTierStyle(customer.tier)`. Line ID shows "Not linked" in italic if `null`. Three action icon buttons with correct hover colors.

Build `CustomerDetailPanel.tsx` as a right-side slide-in panel (`fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-[150] transform transition-transform`). Panel opens when `viewingCustomerId` state is set.

**Completion check:** Search filters by name, phone, and Line ID in real-time. Tier dropdown filters correctly. Customer detail panel slides in and shows order history. Adjust Points modal opens and fires `PATCH` mutation.

---

### Phase 9 — Menu Page

Build `Menu.tsx` with `activeCategory` state (default `'All'`) and `showInStockOnly` boolean. Categories derived dynamically from data.

Build `MenuCard.tsx` with image area, category badge, name, price, availability Toggle, and Edit/Delete icon buttons. Toggle fires `patchMenuItemAvailability` mutation with optimistic update. Edit/Delete buttons are `opacity-0 group-hover:opacity-100`.

Build `MenuItemModal.tsx` as full-page overlay. Image upload drag-drop zone with `border-2 border-dashed border-[#C8CDD6]`. Form with 2-column grid. Category select populated from existing categories. Save fires `POST /api/menu` or `PATCH /api/menu/:id` depending on whether editing.

**Completion check:** Category tabs filter correctly. `showInStockOnly` toggle works. Availability toggle updates immediately (optimistic) and rolls back on failure. Add New Item modal opens, form validates, and submits.

---

### Phase 10 — Orders Page

Build `Orders.tsx` with `activeTab: 'active' | 'historical'` state. Tab underline indicator with `::after` pseudo-element via Tailwind's `after:` prefix. Active Orders count badge next to tab label.

Build `OrderRow.tsx` matching exact column layout: ID `min-w-[40px]`, summary `flex-1 truncate`, status badge `min-w-[58px] text-center`, elapsed `min-w-[38px] text-right`. New-status rows show Accept button.

Implement Accept optimistic update:
```typescript
const acceptMutation = useMutation({
  mutationFn: (id: string) => updateOrderStatus(id, 'Cooking'),
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ['orders'] });
    const prev = queryClient.getQueryData<Order[]>(['orders']);
    queryClient.setQueryData<Order[]>(['orders'], old =>
      old?.map(o => o.id === id ? { ...o, status: 'Cooking' } : o) ?? []);
    return { prev };
  },
  onError: (_, __, ctx) => queryClient.setQueryData(['orders'], ctx?.prev),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
});
```

Build `NewOrderModal.tsx` as full-page overlay. Order type select, table/staff input, menu item card grid, order summary panel with `formatTHB()` totals and Confirm button.

**Completion check:** Tab switching shows correct orders. Sidebar badge count matches active tab's New+Cooking orders. Accepting an order instantly shows Cooking badge before API responds. New Order modal opens, items can be added/removed, total updates correctly.

---

### Phase 11 — Tables Page

Build `Tables.tsx` with filter state and `tableView: 'grid' | 'list'` from `useUIStore`. Grid/list toggle buttons visible `hidden md:flex`.

Build `TableCard.tsx`. Use `useMemo` to compute top border and header tint color from table status. Available card: render SVG table icon centered. Occupied card: render order summary section. Primary action button reflects status.

Build `TableDetailModal.tsx` with `backdrop-blur-md bg-[#1A2333]/60`. Left panel and right panel layout. Service charge computed as `subtotal * SERVICE_CHARGE`. Available table right panel: `opacity-40 pointer-events-none`.

Build list view table with all columns.

**Completion check:** Filter pills show correct subset. Grid/list toggle works. TableCard shows correct colors per status. TableDetailModal shows full order with service charge. Transfer Table button opens a second modal with table select.

---

### Phase 12 — Promotions Page

Build `Promotions.tsx` using `usePromotions()`. Compute `getPromoStatus()` for each promo in `useMemo`.

Build `PromotionRow.tsx` with all seven columns. Status Toggle fires `PATCH` mutation. Expired rows: `opacity-60`, Edit button disabled. Expiring-soon To date: `text-[#C96A00] font-medium`.

Build `CreatePromoModal.tsx` as centered standard modal (not full-page). Code input auto-uppercases on `onChange: e => setCode(e.target.value.toUpperCase())`. Validate uniqueness against existing promo codes before enabling Save. Deactivate fires `PATCH`. Delete opens `ConfirmModal` then fires `DELETE`.

**Completion check:** Status badges render correctly for Active, Scheduled, ExpSoon, and Expired promos. Creating a promo with a duplicate code shows inline error. Toggle deactivates immediately (optimistic update). Delete confirmation modal works.

---

### Phase 13 — Stock Page

Build `Stock.tsx` with search state and sort state. `useMemo` derives filtered and sorted list: search by `ingredientName.toLowerCase().includes(query)`, sort by selected criteria.

Build `StockRow.tsx`. Status badge via `getStockStatus(lot.quantity, lot.reorderPoint, lot.expiryDate)` then `getStockStatusStyle(status)`. Active Status toggle fires `PATCH /api/stock/:id` with `{ active: !lot.active }`.

Build `NewLotModal.tsx` as full-page overlay. Spreadsheet grid with 20 default rows. "+ Add 10 Rows" appends 10 more rows. Row number column on `#E5E7EB` background. Each cell: controlled `<input>` with `onFocus` CSS class applying `bg-[#EBF5FF] outline outline-2 outline-[#2563EB] -outline-offset-[2px]`. "Import Data" button fires `POST /api/stock/lots` with all non-empty rows, shows loading spinner while pending.

**Completion check:** `getStockStatus` integration renders correct badge colors. Search filters ingredient name in real-time. Sort by status puts Empty rows first. New Lot modal spreadsheet is fully editable and saves correctly.

---

### Phase 14 — Waste Log Page

This is the most complex page. `WasteFormProvider` must be in place (from router setup in Step 1.4).

Build `WasteLog.tsx` and `WasteRow.tsx`. Main table renders from API data (already-saved waste entries). Waste ID column uses `font-mono`. Est. Value Lost column shows `-฿{value}` in `text-[#E24B4A] font-medium`.

Build `RecordWasteModal.tsx` as full-page overlay. Spreadsheet grid managed by `WasteFormProvider`'s `useReducer`. Implement all three actions: `ADD_ROW`, `DELETE_ROW`, `UPDATE_CELL`. Cost field: `<input readOnly className="bg-[#F9FAFB] text-[#9AA3AE]" value={formatTHB(row.cost)} />` — visually distinct from editable cells. Reason column: `<select>` with the four `WasteReason` options. "Save Records" fires batch `POST /api/waste`, shows spinner while pending, closes modal and invalidates `['waste']` query on success.

**Completion check:** Monthly total footer updates as quantities change. Cost auto-computes from stock unit prices. Saving all rows at once works. Monthly total matches Dashboard's Recent Waste card (both from same API endpoint).

---

### Phase 15 — Staff Page

Build `Staff.tsx`. `ProtectedRoute` redirects non-owner/manager roles. Role filter and search filter both applied via `useMemo`.

Build `StaffRow.tsx`. Avatar background from `getStaffAvatarStyle(staff.role)`. Locked rows: `opacity-75`. Owner row: all action buttons disabled with `cursor-not-allowed`. Pending rows: all action buttons greyed out with "Pending" badge in place of status toggle.

Manage Access button: for locked staff fires `PATCH` to unlock (`{ isLocked: false }`). For active staff fires `PATCH` to lock (`{ isLocked: true }`). Both are optimistic updates.

Build `InviteStaffModal.tsx`. On submit: `POST /api/staff/invite` with `{ email, role }`. New row appears immediately in table with "Pending" badge (optimistic insert into cache).

**Completion check:** Non-owner/manager visiting `/staff` redirects to Dashboard. Role filter works. Locking/unlocking toggles row opacity immediately. Invite creates Pending row. Owner row actions are all disabled.

---

### Phase 16 — AI Widget Context Injection

Now that all pages exist, wire up `AIContextProvider` on each page.

For each page, add `useEffect` that calls `useAIWidgetStore.setPageContext()` with the appropriate context data from that page's query results. Example for Stock page:

```typescript
const { data: stockLots } = useStock();
useEffect(() => {
  setPageContext({
    page: 'stock',
    contextData: {
      lowStockItems: stockLots?.filter(l => getStockStatus(l.quantity, l.reorderPoint, l.expiryDate) === 'Low Stock') ?? [],
      expiringSoonItems: stockLots?.filter(l => getStockStatus(l.quantity, l.reorderPoint, l.expiryDate) === 'Exp Soon') ?? [],
    }
  });
}, [stockLots]);
```

Context is injected into the AI system prompt on every message send in `useChat()`.

**Completion check:** AI widget shows relevant context when asked "what's low on stock?" while on the Stock page. Context changes when navigating to a different page.

---

### Phase 17 — Error Boundaries and Skeleton Screens

Wrap every page with `<ErrorBoundary FallbackComponent={PageErrorFallback}>`. `PageErrorFallback` renders a centered card with the error message and a "Try again" button that calls `resetErrorBoundary()`.

Add `SkeletonRow.tsx`: a `<tr>` with animated `animate-pulse` divs matching the width proportions of each page's table columns. Driven by `isLoading` from TanStack Query.

Add skeleton `StatCard`: same dimensions as real card but with pulse bars instead of values.

Add skeleton revenue chart: five equal-height gray bars with pulse animation.

Every `useQuery` should now show skeleton on first load and on refetch if `isPlaceholderData` is true.

**Completion check:** Artificially delay MSW handlers by 1 second and verify all pages show skeletons. Simulate a `500` response from an MSW handler and verify the error boundary renders without crashing the whole app.

---

### Phase 18 — Full Test Coverage Pass and Performance Review

Run full test suite: `npx vitest run`. All tests must pass.

Performance checklist:
- Verify `useMemo` is used on every filtered/sorted list (Orders tab filter, Menu category filter, Stock search+sort, Customer search+tier filter, Staff role+search filter, Promotions status filter)
- Verify no components subscribe to `useOrders()` unnecessarily — only Sidebar and Orders page
- Verify TanStack Query `staleTime` is set appropriately per resource (orders: 15s, tables: 10s, menu: 5min, stock: 2min, customers: 5min, staff: 5min)
- Verify `useClickOutside` attaches to `document` once and removes listener on unmount
- Verify `AIWidget` does not re-render on navigation (it is mounted in Layout, above `<Outlet />`)
- Run Vite build (`npm run build`) and verify no TypeScript errors, no unused imports
- Open browser DevTools and verify no console errors on any page
- Verify mobile layout on 375px viewport: sidebar overlays correctly, stat counters hide on mobile, grid view switches to list on Tables page below `md` breakpoint

**Final sign-off criteria:**
1. All 18 unit tests pass
2. All 5 component integration tests pass
3. `npm run build` completes with zero TypeScript errors
4. All 9 pages render correctly with MSW mock data
5. Sidebar badge updates live when order status changes
6. Optimistic updates work on Orders (Accept), Menu (availability toggle), Promotions (deactivate), Stock (active toggle)
7. Error boundaries render on simulated API failures
8. Skeleton screens appear on all pages during loading
9. AI widget context updates on every page navigation
10. Mobile layout passes visual inspection at 375px viewport width

---

*End of React Migration Plan v4 — พุงกาง Restaurant Platform*