Now I have the full picture. Let me write your complete teacher breakdown — all copy-pasteable text.

🍽️ PUNGKANG — React Teacher Breakdown

📦 PART 1: What Is This App?
Pungkang is a Restaurant Management System (ระบบจัดการร้านอาหาร) built with React + TypeScript. Think of it as a digital backend-office for a restaurant — staff login, see tables, manage orders, track stock, log waste, run promotions, and see analytics on a dashboard.

🏗️ PART 2: The Big Architecture — How Layers Work
┌─────────────────────────────────────────────────────┐
│                    BROWSER                          │
│                                                     │
│  index.html  ←  React mounts here (#root)          │
│                                                     │
│  main.tsx  ←  THE BRAIN — sets up everything       │
│    │                                                │
│    ├── 🛣️  React Router  (handles URL/navigation)  │
│    ├── 🗄️  TanStack Query (handles server data)    │
│    └── 🔐  AuthProvider  (handles who is logged in)│
│                                                     │
│  Layout.tsx  ←  THE SHELL (Sidebar + Header)       │
│    └── <Outlet />  ←  pages render here            │
│         ├── Dashboard.tsx                           │
│         ├── Tables.tsx                              │
│         ├── Orders.tsx                              │
│         └── ... (all other pages)                  │
└─────────────────────────────────────────────────────┘

🔄 PART 3: Data Flow — How Each Part Talks to Each Other
USER CLICKS SOMETHING
        │
        ▼
   📄 Page Component  (e.g. Tables.tsx)
        │  calls
        ▼
   🪝 Custom Hook  (e.g. useTables.ts)
        │  calls
        ▼
   🔁 TanStack Query  (useQuery / useMutation)
        │  calls
        ▼
   🌐 API Function  (e.g. api/tables.ts)
        │  calls
        ▼
   📡 axios apiClient  (api/client.ts → /api/...)
        │  intercepted by
        ▼
   🎭 MSW Mock Server  (in development only)
        │  returns fake data
        ▼
   📦 Data flows BACK UP through the chain
        │
        ▼
   🖼️ UI renders with real data

🧩 PART 4: File-by-File Explanation

4.1 — main.tsx — The App Launcher
This is where EVERYTHING starts. It does 4 things in order:
main.tsx does this:
1️⃣  Start MSW (fake API server in dev mode)
2️⃣  Create QueryClient (data cache config)
3️⃣  Create Router (all URL routes)
4️⃣  Render <App> into index.html #root

Router structure:
path "/"  →  <AuthProvider><Layout />
   ├── index (/)        → <Dashboard />
   ├── /tables          → <Tables />
   ├── /orders          → <Orders />
   ├── /menu            → <Menu />
   ├── /stock           → <Stock />
   ├── /waste           → <WasteLog />
   ├── /promotions      → <Promotions />
   ├── /customers       → <Customers />
   └── /staff           → <Staff />

path "*" (anything else) → redirect to "/"

Why wrap everything in <AuthProvider><Layout />?
Because ALL pages share the same sidebar + header + auth check. This is nested routing — Layout is the parent, pages are the children rendered inside <Outlet />.

One important detail: main.tsx uses a prepareApp() async function that starts MSW BEFORE React renders anything. This prevents any real API calls from escaping to the network during development.

async function prepareApp() {
  if (import.meta.env.MODE === 'development') {
    const { worker } = await import('./mocks/browser')
    return worker.start({ onUnhandledRequest: 'bypass' })
  }
  return Promise.resolve()
}
prepareApp().then(() => { ReactDOM.createRoot(...).render(...) })

The QueryClient is configured with two defaults that matter:
  retry: 1           → if a request fails, try once more (not 3 times)
  refetchOnWindowFocus: false  → don't re-fetch just because the user switches tabs


4.2 — types/index.ts — The Data Dictionary
This file defines the shape of every piece of data in the app. Think of it as an agreement between frontend and backend.

Type Name          What It Represents         Key Fields
Order              A customer order           id, tableId, items[], total, status
OrderItem          One item inside an order   menuItemId, name, quantity, price
Table              A restaurant table         id, number, seats, area, status
MenuItem           A dish on the menu         id, name, category, price, available
StockLot           An ingredient in inventory ingredientName, quantity, expiryDate
WasteEntry         A waste record             itemName, reason, quantity, estimatedCost
Promotion          A discount code            code, discountType, discountValue, active
Customer           A customer profile         name, tier, points, totalSpent
Staff              An employee                name, role, area, isLocked
Notification       An alert notification      title, urgency, read
Message            An AI chat message         role ('user'|'ai'), text, timestamp
AIContext          AI widget page context     page, contextData

Status types (allowed values only):
OrderStatus  →  'New' | 'Cooking' | 'Ready' | 'Paid' | 'Delivered' | 'Cancelled'
OrderType    →  'In-Restaurant' | 'Take Away' | 'Delivery'
TableStatus  →  'Available' | 'Eating' | 'Cooking' | 'Payment'
StockStatus  →  'Good' | 'Low Stock' | 'Exp Soon' | 'Empty'
PromoStatus  →  'Active' | 'ExpSoon' | 'Scheduled' | 'Expired'
CustomerTier →  'VIP' | 'Gold' | 'Silver' | 'Basic'
StaffRole    →  'owner' | 'manager' | 'cashier' | 'server' | 'kitchen'
WasteReason  →  'Expired' | 'Wrong Order' | 'Accident/Spill' | 'Quality Control'
Urgency      →  'urgent' | 'new' | 'normal'

TypeScript uses these to make sure nobody accidentally passes the wrong value anywhere.

Notice that Order.tableId is optional (tableId?) — because Take Away and Delivery orders don't belong to a table. TypeScript makes you handle the "maybe undefined" case everywhere you use it.


4.3 — api/client.ts + api/orders.ts — The Network Layer
client.ts creates ONE shared axios instance that all API files use:

apiClient
  baseURL = '/api'               ← all requests go to /api/...
  Content-Type = application/json
  interceptor = log errors automatically

orders.ts then uses that client for specific operations:
Function                       HTTP Method  Endpoint          What It Does
getOrders()                    GET          /api/orders       Fetch all orders
updateOrderStatus(id, status)  PATCH        /api/orders/:id   Change one order's status
createOrder(order)             POST         /api/orders       Create a new order

All other API files (tables.ts, menu.ts, stock.ts, waste.ts, promotions.ts,
customers.ts, staff.ts, dashboard.ts) follow this exact same pattern.
One client, many resource files.

The interceptor is important:
apiClient.interceptors.response.use(
  (response) => response,        // success: pass through untouched
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error) // still reject so hooks know it failed
  }
)
This means every failed request is automatically logged, so you don't need
console.error() in every hook or component.


4.4 — store/ — Global State (Zustand)
Zustand stores are like useState but shared across the entire app. No props needed.
The app has FOUR Zustand stores:

useAuthStore — who is logged in:
State it holds:
  user          → Staff object or null
  role          → 'owner' | 'manager' | ... | null
  workspace     → area string or null
  isAuthenticated → true / false

Actions:
  login(user)   → sets all fields from the user object
  logout()      → resets everything to null/false

useUIStore — UI visual state:
State it holds:
  sidebarOpen   → true / false
  activePopup   → 'profile' | 'notifications' | 'settings' | null
  tableView     → 'grid' | 'list'

Actions:
  toggleSidebar()       → flip sidebarOpen
  setSidebarOpen(val)   → set to specific value
  openPopup(name)       → set activePopup
  closeAllPopups()      → set activePopup to null
  setTableView(view)    → set 'grid' or 'list'

useNotificationStore — the notification bell:
State it holds:
  notifications[]       → array of Notification objects

Actions:
  markAsRead(id)        → marks one notification read
  markAllAsRead()       → marks all notifications read
  addNotification(n)    → pushes a new notification in

Why a separate store? The Header bell icon reads from here, and any page could
add a new notification. Zustand makes this cross-component sharing trivial.

useAIWidgetStore — the floating AI chat widget:
State it holds:
  isOpen        → true / false
  messages[]    → array of Message objects (chat history)
  context       → AIContext (what page the AI should be aware of)

Actions:
  open() / close() / toggle()   → control visibility
  addMessage(msg)               → append to chat history
  setContext(ctx)               → update the AI's page awareness
  clearMessages()               → reset the conversation

This store powers the AIWidget floating button visible on every page.
The context field tells the AI which page the user is on and relevant data,
so the AI can give page-aware responses.

Why Zustand instead of useState?
With useState:
  Header needs sidebar state
  → pass to Layout
  → pass to Sidebar
  → prop drilling nightmare ❌

With Zustand:
  Header calls useUIStore()
  Sidebar calls useUIStore()
  Both get same state, no props needed ✅


4.5 — providers/ — React Context Providers
The app has TWO providers in the providers/ folder:

AuthProvider (providers/AuthProvider.tsx):
This wraps the entire app (via <AuthProvider><Layout /></AuthProvider> in main.tsx).
Its job is to check if a user is already logged in when the app boots, and to
show a login screen if not. It talks to useAuthStore internally.

Think of AuthProvider as a "gatekeeper":
  App boots → AuthProvider checks → logged in? show app : show login form

WasteFormProvider (providers/WasteFormProvider.tsx):
This wraps just the WasteLog page. It manages the open/close state and form
data for the "Record Waste" modal. Putting this in a provider (instead of
useState in WasteLog.tsx itself) means child components like WasteRow and
RecordWasteModal can both access and modify the form state without prop drilling.

Pattern: when a piece of state is needed by a page AND its child components,
a scoped Context Provider is cleaner than passing it as props.


4.6 — hooks/ — Business Logic (Custom Hooks)
Custom hooks are where the real logic lives. They connect TanStack Query → API layer.
The app has 11 custom hooks:

useOrders.ts example — full breakdown:
useOrders() returns:
  orders        → array of Order objects (or [] if loading)
  isLoading     → true while fetching
  isError       → true if fetch failed
  updateStatus  → function(id, status) to change an order
  isUpdating    → true while update is in progress
  createOrder   → function(order) to make new order
  isCreating    → true while create is in progress

Under the hood:
useQuery(['orders'], getOrders)
  → runs getOrders() on mount
  → caches result under key ['orders']
  → auto-refetches when needed

useMutation(updateOrderStatus)
  → on success → invalidates ['orders'] cache
  → this forces useQuery to re-fetch fresh data
  → UI automatically updates ♻️

This is the "cache invalidation" pattern. You mutate → invalidate cache → re-fetch → UI rerenders with new data.

The other hooks follow the same pattern:
Hook              Manages                API files it calls
useTables         Table list             api/tables.ts
useOrders         Order list             api/orders.ts
useMenu           Menu items             api/menu.ts
useStock          Stock/inventory lots   api/stock.ts
useWaste          Waste log entries      api/waste.ts
usePromotions     Promotions             api/promotions.ts
useCustomers      Customer profiles      api/customers.ts
useStaff          Staff members          api/staff.ts
useDashboard      Summary stats          api/dashboard.ts

Two hooks are "utility" hooks (no API calls):
useClickOutside(ref, callback)  → fires callback when user clicks outside a ref element
                                  Used by popup menus (profile, notifications)
useAutoResize(ref)              → auto-resizes a textarea as the user types
                                  Used by the AI chat widget input


4.7 — utils/ — Helper Functions
Small pure functions used throughout the app:

format.ts         → formatTHB(number) converts 1234.5 to "฿1,234.50"
                  → formatDate(string) formats ISO dates nicely
                  → formatRelativeTime(string) gives "2 hours ago"

statusStyles.ts   → TABLE_STATUS_STYLES maps TableStatus → CSS class names
                  → ORDER_STATUS_STYLES maps OrderStatus → CSS class names
                  Used everywhere a colored badge or chip is rendered

getStockStatus.ts → computes StockStatus from a StockLot object
                    (quantity vs reorderPoint, expiryDate vs today)
                    Returns 'Good' | 'Low Stock' | 'Exp Soon' | 'Empty'

getPromoStatus.ts → computes PromoStatus from a Promotion object
                    (startDate, endDate, active flag)
                    Returns 'Active' | 'ExpSoon' | 'Scheduled' | 'Expired'

constants.ts      → APP_NAME, AREAS[], NAV_ITEMS[], etc.
                    Central place for values used in multiple places

Why put logic in utils instead of in components?
  ✅ Testable in isolation (see __tests__/ folder)
  ✅ No need to render a component to test the logic
  ✅ Reusable across many components without importing React


4.8 — pages/Dashboard.tsx — Page Layer
Dashboard uses useState for local UI state (the period filter) and a custom hook for data:

useState:
  period = 'week'   ← local state, just this page

useDashboard(period):
  → calls API with the period parameter
  → returns { summary, isLoading }

summary contains:
  revenue      → total money earned
  orders       → count of orders
  aov          → average order value
  activeTables → how many tables are occupied

Period buttons logic:
['today', 'week', 'month'].map(p =>
  <button
    className = period === p ? "active style" : "normal style"
    onClick   = () => setPeriod(p)
  >
)

When setPeriod changes, useDashboard(period) re-runs with the new value,
fetches new data, and the whole dashboard rerenders.

Dashboard composes many smaller components:
  StatCard                 → one KPI box (revenue, orders, etc.)
  RevenueChart             → line/bar chart via Recharts
  RecentOrdersList         → last N orders in a panel
  StockAlertCard           → items that are low/expired
  RecentWasteCard          → latest waste entries
  PromotionPerformanceCard → promo usage stats


4.9 — pages/Tables.tsx — Filtering Pattern
This page shows the most important React pattern: derived state with useMemo.

Raw data:
  tables[]  ← from useTables()
  orders[]  ← from useOrders()

Local state:
  search        = ''
  activeFilter  = 'All Tables'
  selectedTable = null

Derived (computed, not stored):
  filteredTables = useMemo(() => {
    filter tables by search text
    filter tables by activeFilter
    return filtered result
  }, [tables, search, activeFilter])
  ← only recalculates when dependencies change

Why useMemo here?
Without it, filteredTables recalculates on every render — even unrelated rerenders.
With it, it only recalculates when tables, search, or activeFilter actually change.

The page also has getTableOrder(tableId):
  → finds the active order for a given table
  → "active" means status is NOT 'Paid' or 'Cancelled'
  → passed into each <TableCard> so cards can show order info

Grid view comes from useUIStore().tableView — this persists across navigation
because it lives in Zustand, not local useState.


4.10 — Layout.tsx — The Shell
Layout renders:
┌─────────────────────────────────────────┐
│  <Sidebar />    │  <Header />           │
│                 ├───────────────────────│
│  (navigation    │  <Outlet />           │
│   links)        │  (current page        │
│                 │   renders here)       │
│                 │                       │
└─────────────────┴───────────────────────┘
                  <AIWidget />  (floating)

<Outlet /> is from React Router — it's where the current URL's page component renders.
When you go to /tables, React Router puts <Tables /> inside that <Outlet />.

The AIWidget is outside the main content area entirely — it's positioned fixed
on screen, floating above everything, always accessible regardless of which page
you're on.


4.11 — mocks/ — The Fake API
Two files power the development experience without a real backend:

browser.ts    → creates and exports the MSW Service Worker
handlers.ts   → array of HTTP handler definitions

A handler looks like:
  http.get('/api/orders', () => {
    return HttpResponse.json([ ...fake order data... ])
  })

The service worker intercepts matching fetch/axios calls in the browser and
returns the fake response — no network request ever leaves your computer.

This means:
  ✅ You can build and test the entire frontend alone
  ✅ Switching to a real backend = remove MSW import, change nothing else
  ✅ The real axios call code is identical in dev and production


🔁 PART 5: Complete Flow Diagram
  Browser loads index.html
          │
          ▼
  main.tsx runs
          │
    ┌─────┴──────┐
    │            │
  MSW starts   QueryClient created
  (dev only)        │
    │               │
    └─────┬─────────┘
          │
    Router created
          │
          ▼
  React renders:
  <QueryClientProvider>
    <RouterProvider>
      <AuthProvider>           ← checks if logged in
        <Layout>               ← Sidebar + Header shell
          <Outlet>             ← current page goes here

User clicks "Tables" in sidebar
          │
          ▼
  React Router changes URL to /tables
          │
          ▼
  Layout's <Outlet> renders <Tables />
          │
          ▼
  Tables.tsx mounts
          │
          ▼
  useTables() called → useQuery(['tables'], getTables)
          │
          ▼
  Is data cached?
    YES → return cached data immediately
    NO  → call getTables() → axios GET /api/tables
              │
              ▼ (in development)
          MSW intercepts → returns fake JSON
              │ (in production)
          Real backend returns real JSON
          │
          ▼
  Data stored in TanStack Query cache
          │
          ▼
  tables[] available in Tables.tsx
          │
          ▼
  filteredTables computed via useMemo
          │
          ▼
  TableCard components rendered for each table
          │
          ▼
  User sees the table grid on screen 🎉


📊 PART 6: Technology Stack Table
Tool              Role                         Where Used
React 19          UI library, component        All .tsx files
TypeScript        Type safety, autocomplete    All files, types/index.ts
Vite              Build tool, dev server       vite.config.ts
React Router v7   URL routing, navigation      main.tsx, all pages
TanStack Query v5 Server state, caching        All custom hooks
Axios             HTTP client                  api/client.ts, all api files
Zustand v5        Global UI/Auth state         store/ folder (4 stores)
Tailwind CSS      Styling via utility classes  All JSX className props
MSW v2            Mock API for development     mocks/browser.ts, mocks/handlers.ts
Recharts          Charts/graphs                RevenueChart.tsx
Lucide React      Icons                        All pages
Vitest            Unit testing                 __tests__/ folder
React Error Boundary  Graceful error UI        Wraps key sections


🧱 PART 7: Layer Responsibility Summary
LAYER           FILES                         DOES WHAT
──────────────────────────────────────────────────────────────────
Config          package.json, vite.config     Project setup
Entry           main.tsx                      Boot the app
Types           types/index.ts                Shape of data
API             api/client.ts, api/*.ts       Talk to backend
Store           store/*.ts  (4 stores)        Global state
Providers       providers/*.tsx               App-wide context gates
Hooks           hooks/*.ts  (11 hooks)        Business logic
Components      components/**/*.tsx           Reusable UI bits
Pages           pages/*.tsx  (9 pages)        Full page views
Utils           utils/*.ts                    Helper functions, pure logic
Mocks           mocks/                        Fake API in dev
Tests           __tests__/                    Automated tests


📚 PART 8: Extra Things You Can Learn from This Codebase

8.1 — TanStack Query Cache Invalidation Pattern
// After a mutation succeeds, tell Query to refetch
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['orders'] })
}
// This is the "stale data" problem solved elegantly

8.2 — useMemo for Performance
// Only recalculate filteredTables when inputs change
const filteredTables = useMemo(() => {
  return tables.filter(t => matchesSearch && matchesFilter)
}, [tables, search, activeFilter])
// Without this, it recalculates on EVERY render

8.3 — Zustand vs Context API
Context API:          Zustand:
- Built into React    - External library
- Causes re-renders   - Granular re-renders
  of ALL consumers      (only subscribed state)
- Good for theme,     - Good for complex global
  locale, auth          UI state, auth, carts

Pungkang uses BOTH:
  Zustand    → auth, UI state, notifications, AI widget (app-wide, many consumers)
  Context    → WasteFormProvider (scoped to one page + its children only)

8.4 — MSW (Mock Service Worker) Pattern
Development flow:
  Your code → axios → /api/orders
                           ↓
                    MSW intercepts (like a fake server)
                    returns fake JSON data
                           ↓
                    Your React app works with NO real backend

Production flow:
  Your code → axios → /api/orders → Real backend server

This lets frontend and backend teams work independently.

8.5 — TypeScript Unions as Documentation
// This forces the UI to only show valid statuses
type OrderStatus = 'New' | 'Cooking' | 'Ready' | 'Paid' | 'Delivered' | 'Cancelled'
// If you type 'Cooking' wrong → TypeScript catches it at compile time
// If you add a new status → TypeScript tells you everywhere to update

Extra in Pungkang: WasteReason and Urgency are also typed unions,
not free-form strings. Even the AI message role is typed:
  role: 'user' | 'ai'   ← can never accidentally be 'bot' or 'assistant'

8.6 — The Repository/Hook Pattern
Direct (bad):
  Page component → fetch() → render

Repository Hook (good):
  Page component → useOrders() → TanStack Query → api/orders.ts → axios

Benefits:
  ✅ Page doesn't know WHERE data comes from
  ✅ Easy to swap real API for mock API
  ✅ Caching is automatic
  ✅ Loading/error states are built in

8.7 — Computed Status from Raw Data (getStockStatus / getPromoStatus)
Instead of storing a computed status in the database and keeping it in sync,
Pungkang computes status on the fly from raw data:

getStockStatus(lot: StockLot): StockStatus
  → if quantity === 0       → 'Empty'
  → if quantity < reorder   → 'Low Stock'
  → if expiry < 3 days away → 'Exp Soon'
  → otherwise               → 'Good'

getPromoStatus(promo: Promotion): PromoStatus
  → if not active + expired → 'Expired'
  → if not started yet      → 'Scheduled'
  → if ends within 3 days   → 'ExpSoon'
  → otherwise               → 'Active'

This pattern keeps the backend simple (just raw numbers and dates) and puts
display logic in the frontend where it belongs. And it's easy to test — no
React needed, just pure TypeScript functions (see __tests__/).

8.8 — Scoped Provider Pattern (WasteFormProvider)
When a modal's state is needed by BOTH the page and a child row component:

❌ Prop drilling approach:
  WasteLog → passes openModal prop → WasteRow → calls it on click

✅ Scoped Provider approach:
  WasteFormProvider wraps the page
  WasteRow calls useWasteForm() to open the modal
  RecordWasteModal calls useWasteForm() to read form data
  No props needed

8.9 — Utility Hooks (not data hooks)
Two hooks don't touch the server at all:

useClickOutside(ref, callback):
  Attaches a document click listener on mount
  Calls callback when the click is outside the ref element
  Cleans up on unmount
  Used by: Header popups (profile, notifications, settings)

useAutoResize(ref):
  Sets textarea height to 'auto' then to its scrollHeight on every change
  Creates expanding textarea behavior
  Used by: AI widget message input

These are utility/behavioral hooks — reusable logic with no business knowledge.


🎯 PART 9: Reading Order for Learning
If you want to understand this codebase from scratch, read files in this order:
1.  types/index.ts              ← understand the data shapes first
2.  api/client.ts               ← understand how HTTP calls are made
3.  api/orders.ts               ← understand one API resource fully
4.  store/useAuthStore.ts       ← understand global auth state
5.  store/useUIStore.ts         ← understand global UI state
6.  store/useNotificationStore.ts ← understand notification state
7.  store/useAIWidgetStore.ts   ← understand the AI widget state
8.  hooks/useOrders.ts          ← understand how query+API connect
9.  utils/getStockStatus.ts     ← understand pure computed logic
10. utils/statusStyles.ts       ← understand style mapping pattern
11. providers/AuthProvider.tsx  ← understand the auth gate
12. providers/WasteFormProvider.tsx ← understand scoped context pattern
13. main.tsx                    ← understand app boot + routing
14. components/layout/Layout.tsx ← understand the shell
15. pages/Dashboard.tsx         ← understand a full page
16. pages/Tables.tsx            ← understand filtering + memo pattern


🔑 PART 10: Key Mental Models

MENTAL MODEL 1 — "Layers go downward, data flows upward"
  Page → Hook → Query → API → Server
  Page ← Hook ← Query ← API ← Server

MENTAL MODEL 2 — "Each layer knows only its neighbor"
  Page doesn't know about axios
  Hook doesn't know about the DOM
  API doesn't know about React state

MENTAL MODEL 3 — "State lives at the right level"
  Local state (useState)     → one component only (period filter, selectedTable)
  Scoped context (Provider)  → one page + its children (WasteFormProvider)
  Global state (Zustand)     → many components (sidebar, auth, notifications, AI)
  Server state (TanStack Q)  → comes from the network (orders, tables, stock...)

MENTAL MODEL 4 — "Types are documentation that enforces itself"
  OrderStatus type → the only allowed values, checked at compile time
  Optional fields (tableId?) → TypeScript forces you to handle the undefined case

MENTAL MODEL 5 — "Mock first, real API second"
  MSW lets you build the entire frontend without a backend
  When backend is ready, just remove MSW, nothing else changes

MENTAL MODEL 6 — "Compute status, don't store it"
  Raw data lives in the database (quantity, expiryDate, active, endDate)
  Derived status (Low Stock, Expired) is computed in the frontend
  This keeps the backend simple and display logic testable

MENTAL MODEL 7 — "Pure utils are always testable"
  getStockStatus(), getPromoStatus(), formatTHB() — no React, no DOM
  They take input, return output
  That's why __tests__/ can test them with zero setup