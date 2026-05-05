# Pungkang Project - Consolidated Codebase Summary

This document contains the project structure, core architecture, logic, and data structures of the Pungkang React application. It is designed to provide a comprehensive understanding of how the system is built.

## Project Structure

```text
pungkang/
  tsconfig.node.json
  index.html
  tailwind.config.js
  tsconfig.app.json
  README.md
  public/
    mockServiceWorker.js
    icons.svg
    favicon.svg
  package.json
  tsconfig.json
  eslint.config.js
  vite.config.ts
  postcss.config.js
  src/
    main.tsx
    index.css
    mocks/
      browser.ts
      handlers.ts
    types/
      index.ts
    test/
      setup.ts
    providers/
      WasteFormProvider.tsx
      AuthProvider.tsx
    utils/
      statusStyles.ts
      getPromoStatus.ts
      format.ts
      constants.ts
      getStockStatus.ts
    components/
      common/
        Badge.tsx
      customers/
        CustomerRow.tsx
        CustomerDetailPanel.tsx
      tables/
        TableDetailModal.tsx
        TableCard.tsx
      layout/
        AIWidget.tsx
        Layout.tsx
        SidebarNavItem.tsx
        Header.tsx
        Sidebar.tsx
      dashboard/
        StockAlertCard.tsx
        RecentWasteCard.tsx
        StatCard.tsx
        PromotionPerformanceCard.tsx
        RecentOrdersList.tsx
        RevenueChart.tsx
      promotions/
        PromotionRow.tsx
      menu/
        MenuCard.tsx
      staff/
        StaffRow.tsx
      orders/
        OrderRow.tsx
      stock/
        StockRow.tsx
      waste/
        WasteRow.tsx
        RecordWasteModal.tsx
    __tests__/
      format.test.ts
      getStockStatus.test.ts
      getPromoStatus.test.ts
      smoke.test.tsx
      constants.test.ts
    hooks/
      useMenu.ts
      usePromotions.ts
      useOrders.ts
      useClickOutside.ts
      useAutoResize.ts
      useStaff.ts
      useTables.ts
      useWaste.ts
      useDashboard.ts
      useStock.ts
      useCustomers.ts
    api/
      customers.ts
      tables.ts
      menu.ts
      dashboard.ts
      stock.ts
      orders.ts
      client.ts
      staff.ts
      waste.ts
      promotions.ts
    assets/
      hero.png
      vite.svg
    pages/
      Dashboard.tsx
      Stock.tsx
      Promotions.tsx
      Tables.tsx
      Menu.tsx
      Orders.tsx
      WasteLog.tsx
      Staff.tsx
      Customers.tsx
    store/
      useAIWidgetStore.ts
      useUIStore.ts
      useNotificationStore.ts
      useAuthStore.ts
```

## 1. Configuration & Entry Point

### `package.json`
**Responsibility:** Manages dependencies, scripts, and project metadata.
```json
{
  "name": "pungkang",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "test": "vitest run",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.100.9",
    "axios": "^1.16.0",
    "lucide-react": "^1.14.0",
    "msw": "^2.14.2",
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "react-error-boundary": "^6.1.1",
    "react-router-dom": "^7.14.2",
    "recharts": "^3.8.1",
    "zustand": "^5.0.12"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^24.12.2",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.5.0",
    "eslint": "^10.2.1",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.5.0",
    "jsdom": "^29.1.1",
    "postcss": "^8.5.13",
    "tailwindcss": "^3.4.17",
    "typescript": "~6.0.2",
    "typescript-eslint": "^8.58.2",
    "vite": "^8.0.10",
    "vitest": "^4.1.5"
  },
  "msw": {
    "workerDirectory": [
      "public"
    ]
  }
}
```

### `src/main.tsx`
**Responsibility:** App entry point, initializes React Router, TanStack Query, and MSW.
```tsx
import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./index.css"

import { AuthProvider } from "./providers/AuthProvider"
import Layout from "./components/layout/Layout"
import Dashboard from "./pages/Dashboard"
import Tables from "./pages/Tables"
import Orders from "./pages/Orders"
import Menu from "./pages/Menu"
import Stock from "./pages/Stock"
import WasteLog from "./pages/WasteLog"
import Promotions from "./pages/Promotions"
import Customers from "./pages/Customers"
import Staff from "./pages/Staff"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthProvider><Layout /></AuthProvider>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "tables", element: <Tables /> },
      { path: "orders", element: <Orders /> },
      { path: "menu", element: <Menu /> },
      { path: "stock", element: <Stock /> },
      { path: "waste", element: <WasteLog /> },
      { path: "promotions", element: <Promotions /> },
      { path: "customers", element: <Customers /> },
      { path: "staff", element: <Staff /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> }
])

async function prepareApp() {
  if (import.meta.env.MODE === 'development') {
    const { worker } = await import('./mocks/browser')
    return worker.start({ 
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js'
      }
    })
  }
  return Promise.resolve()
}

prepareApp().then(() => {
  const rootElement = document.getElementById('root')
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </React.StrictMode>
    )
  }
})
```

---

## 2. Data Models (TypeScript Types)

### `src/types/index.ts`
**Responsibility:** Centralized type definitions for all domain entities.
```tsx
// Core types
export type OrderStatus = 'New' | 'Cooking' | 'Ready' | 'Paid' | 'Delivered' | 'Cancelled'
export type OrderType = 'In-Restaurant' | 'Take Away' | 'Delivery'
export type TableStatus = 'Available' | 'Eating' | 'Cooking' | 'Payment'
export type StockStatus = 'Good' | 'Low Stock' | 'Exp Soon' | 'Empty'
export type PromoStatus = 'Active' | 'ExpSoon' | 'Scheduled' | 'Expired'
export type CustomerTier = 'VIP' | 'Gold' | 'Silver' | 'Basic'
export type StaffRole = 'owner' | 'manager' | 'cashier' | 'server' | 'kitchen'
export type WasteReason = 'Expired' | 'Wrong Order' | 'Accident/Spill' | 'Quality Control'
export type Urgency = 'urgent' | 'new' | 'normal'

// Entity interfaces
export interface Order {
  id: string;
  type: OrderType;
  tableId?: string;
  staffId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Table {
  id: string;
  number: number;
  seats: number;
  area: string;
  status: TableStatus;
  currentOrderId?: string;
  seatedAt?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
  available: boolean;
  description?: string;
}

export interface StockLot {
  id: string;
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  price: number;
  expiryDate: string | null;
  reorderPoint: number;
  active: boolean;
}

export interface WasteEntry {
  id: string;
  date: string;
  itemName: string;
  reason: WasteReason;
  quantity: number;
  unit: string;
  estimatedCost: number;
  recordedBy: string;
}

export interface Promotion {
  id: string;
  code: string;
  name: string;
  discountType: 'percentage' | 'fixed' | 'free_item';
  discountValue: number;
  startDate: string;
  endDate: string;
  usageCount: number;
  usageLimit?: number;
  totalAmountSaved: number;
  active: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lineId?: string;
  tier: CustomerTier;
  points: number;
  totalSpent: number;
  orderCount: number;
  lastVisit: string;
  lastChannel: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  managerId?: string;
  area: string;
  lastLogin: string;
  isLocked: boolean;
  isPending?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  urgency: Urgency;
  read: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface AIContext {
  page: string;
  contextData: Record<string, unknown>;
}
```

---

## 3. API Layer (Axios)

### `src/api/client.ts`
```tsx
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
```

### Example Resource: `src/api/orders.ts`
```tsx
import { apiClient } from './client';
import { Order, OrderStatus } from '../types';

export const getOrders = async (): Promise<Order[]> => {
  const { data } = await apiClient.get<Order[]>('/orders');
  return data;
};

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
  const { data } = await apiClient.patch<Order>(`/orders/${id}`, { status });
  return data;
};

export const createOrder = async (order: Partial<Order>): Promise<Order> => {
  const { data } = await apiClient.post<Order>('/orders', order);
  return data;
};
```

---

## 4. State Management (Zustand)

### `src/store/useAuthStore.ts`
```tsx
import { create } from 'zustand'
import { Staff, StaffRole } from '../types'

interface AuthState {
  user: Staff | null;
  role: StaffRole | null;
  workspace: string | null;
  isAuthenticated: boolean;
  login: (user: Staff) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  workspace: null,
  isAuthenticated: false,
  login: (user) => set({ 
    user, 
    role: user.role, 
    workspace: user.area, 
    isAuthenticated: true 
  }),
  logout: () => set({ 
    user: null, 
    role: null, 
    workspace: null, 
    isAuthenticated: false 
  }),
}))
```

### `src/store/useUIStore.ts`
```tsx
import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean;
  activePopup: 'profile' | 'notifications' | 'settings' | null;
  tableView: 'grid' | 'list';
  toggleSidebar: () => void;
  setSidebarOpen: (val: boolean) => void;
  openPopup: (name: UIState['activePopup']) => void;
  closeAllPopups: () => void;
  setTableView: (view: UIState['tableView']) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  activePopup: null,
  tableView: 'grid',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (val) => set({ sidebarOpen: val }),
  openPopup: (name) => set({ activePopup: name }),
  closeAllPopups: () => set({ activePopup: null }),
  setTableView: (view) => set({ tableView: view }),
}))
```

---

## 5. Business Logic (Custom Hooks)

### `src/hooks/useOrders.ts`
```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, updateOrderStatus, createOrder } from '../api/orders';
import { OrderStatus, Order } from '../types';

export const useOrders = () => {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => 
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: (order: Partial<Order>) => createOrder(order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    orders: ordersQuery.data ?? [],
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
    createOrder: createOrderMutation.mutate,
    isCreating: createOrderMutation.isPending,
  };
};
```

---

## 6. User Interface (Layout & Pages)

### `src/components/layout/Layout.tsx`
```tsx
import React from "react"
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import AIWidget from './AIWidget'

export default function Layout() {
  return (
    <div className="flex h-screen bg-brand-page overflow-hidden relative">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-brand-page relative">
          <Outlet />
        </main>
      </div>

      <AIWidget />
    </div>
  )
}
```

### `src/pages/Dashboard.tsx`
```tsx
import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'
import { formatTHB } from '../utils/format'
import StatCard from '../components/dashboard/StatCard'
import RevenueChart from '../components/dashboard/RevenueChart'
import RecentOrdersList from '../components/dashboard/RecentOrdersList'
import StockAlertCard from '../components/dashboard/StockAlertCard'
import RecentWasteCard from '../components/dashboard/RecentWasteCard'
import PromotionPerformanceCard from '../components/dashboard/PromotionPerformanceCard'

type Period = 'today' | 'week' | 'month';

export default function Dashboard() {
  const [period, setPeriod] = useState<Period>('week');
  const { summary, isLoading } = useDashboard(period);

  const periodLabels: Record<Period, string> = {
    today: 'วันนี้',
    week: 'สัปดาห์นี้',
    month: 'เดือนนี้',
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="pt-4 px-6 pb-[14px] bg-white border-b border-brand-border-outer flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <div className="text-[20px] font-bold text-brand-text-primary">Dashboard Overview</div>
          <div className="text-[12px] text-brand-text-secondary mt-0.5">Welcome back, Thanachot. Here is what is happening today.</div>
        </div>

        <div className="flex items-center gap-6 hidden md:flex">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Total Revenue</span>
            </div>
            <div className="text-[18px] font-bold text-brand-text-primary">
              {isLoading ? '...' : formatTHB(summary?.revenue ?? 0)}
            </div>
          </div>
          <div className="w-[1px] h-8 bg-brand-border-inner"></div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Total Orders</span>
            </div>
            <div className="text-[18px] font-bold text-brand-text-primary">
              {isLoading ? '...' : summary?.orders}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          {(['today', 'week', 'month'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all ${
                period === p 
                  ? 'bg-brand-active-nav border-brand-border-active text-brand-text-primary shadow-sm' 
                  : 'bg-white border-brand-border-outer text-brand-text-secondary hover:bg-brand-hover-row'
              }`}
            >
              {periodLabels[p]}
              {period === p && <ChevronDown size={11} className="text-brand-text-secondary" />}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Revenue" value={isLoading ? '...' : formatTHB(summary?.revenue ?? 0)} change="+12.5% from last week" changeColor="#1D9E75" dotColor="#1D9E75" />
          <StatCard label="Total Orders" value={isLoading ? '...' : summary?.orders ?? 0} change="+5.2% from last week" changeColor="#1D9E75" dotColor="#3D4A5C" href="/orders" />
          <StatCard label="Avg. Order Value" value={isLoading ? '...' : formatTHB(summary?.aov ?? 0)} change="-2.1% from last week" changeColor="#E24B4A" dotColor="#E24B4A" />
          <StatCard label="Active Tables" value={isLoading ? '...' : summary?.activeTables ?? 0} change="Currently occupied" changeColor="#6B7A8D" dotColor="#C96A00" href="/tables" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-brand-border-outer rounded-xl p-5 flex flex-col">
            <h3 className="text-[14px] font-bold text-brand-text-primary mb-1">Revenue Trends</h3>
            <RevenueChart />
          </div>
          <RecentOrdersList />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StockAlertCard />
          <RecentWasteCard />
          <PromotionPerformanceCard />
        </div>
      </div>
    </div>
  )
}
```

### `src/pages/Tables.tsx`
```tsx
import React, { useState, useMemo } from 'react'
import { Search, Grid, List as ListIcon, Filter, AlertTriangle } from 'lucide-react'
import { useTables } from '../hooks/useTables'
import { useOrders } from '../hooks/useOrders'
import { useUIStore } from '../store/useUIStore'
import { Table } from '../types'
import { TABLE_STATUS_STYLES } from '../utils/statusStyles'
import TableCard from '../components/tables/TableCard'
import TableDetailModal from '../components/tables/TableDetailModal'

export default function Tables() {
  const { tables, isLoading: tablesLoading } = useTables();
  const { orders, isLoading: ordersLoading } = useOrders();
  const { tableView, setTableView } = useUIStore();
  
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Tables');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const filteredTables = useMemo(() => {
    return tables.filter(t => {
      const matchesSearch = t.number.toString().includes(search) || t.area.toLowerCase().includes(search.toLowerCase());
      let matchesFilter = true;
      if (activeFilter === 'Available') matchesFilter = t.status === 'Available';
      else if (activeFilter === 'Occupied') matchesFilter = t.status !== 'Available';
      else if (activeFilter !== 'All Tables') matchesFilter = t.area === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [tables, search, activeFilter]);

  const getTableOrder = (tableId: string) => {
    return orders.find(o => o.tableId === tableId && (o.status !== 'Paid' && o.status !== 'Cancelled'));
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {['All Tables', 'Available', 'Occupied'].map(opt => (
              <button key={opt} onClick={() => setActiveFilter(opt)} className={`px-4 py-1.5 rounded-full text-[12px] border ${activeFilter === opt ? 'bg-brand-text-dark text-white' : 'bg-white text-brand-text-secondary'}`}>{opt}</button>
            ))}
          </div>
          <div className="flex gap-3">
            <input type="text" placeholder="Search table #" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-4 py-1.5 border rounded-lg text-[13px]" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filteredTables.map(table => (
            <TableCard key={table.id} table={table} order={getTableOrder(table.id)} onClick={(t) => setSelectedTable(t)} />
          ))}
        </div>
      </div>
      {selectedTable && <TableDetailModal table={selectedTable} order={getTableOrder(selectedTable.id)} onClose={() => setSelectedTable(null)} />}
    </div>
  )
}
```

---
*Note: This file is a complete summary of the pungkang project for AI ingestion.*
